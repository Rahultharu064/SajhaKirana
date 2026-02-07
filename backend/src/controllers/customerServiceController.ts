// backend/src/controllers/customerServiceController.ts
// Customer Service AI Controller with Order Status, Product Info, and Escalation

import type { Request, Response } from 'express';
import { customerServiceManager } from '../services/customerServiceService';
import { prismaClient } from '../config/client';

interface AuthRequest extends Request {
    user?: {
        id: number;
        email?: string;
        role: string;
    };
}

export const customerServiceController = {
    /**
     * GET /api/chatbot/order-status/:orderId
     * Quick order status lookup for chatbot
     */
    async getOrderStatus(req: AuthRequest, res: Response) {
        try {
            const { orderId } = req.params;
            const userId = req.user?.id;

            if (!userId) {
                return res.status(401).json({
                    success: false,
                    message: 'Authentication required to check order status'
                });
            }

            const orderIdNum = parseInt(orderId || '0');
            if (isNaN(orderIdNum) || orderIdNum === 0) {
                return res.status(400).json({
                    success: false,
                    message: 'Invalid order ID format'
                });
            }

            const order = await prismaClient.order.findFirst({
                where: {
                    id: orderIdNum,
                    userId: userId
                },
                include: {
                    orderItems: {
                        include: {
                            product: {
                                select: {
                                    id: true,
                                    title: true,
                                    images: true,
                                    price: true
                                }
                            }
                        }
                    },
                    payments: {
                        orderBy: { createdAt: 'desc' },
                        take: 1
                    }
                }
            });

            if (!order) {
                return res.status(404).json({
                    success: false,
                    message: `Order #${orderId} not found or doesn't belong to your account`
                });
            }

            // Parse shipping address
            let shippingAddress = null;
            try {
                shippingAddress = JSON.parse(order.shippingAddress);
            } catch (e) {
                shippingAddress = { raw: order.shippingAddress };
            }

            // Calculate estimated delivery
            const createdDate = new Date(order.createdAt);
            const estimatedDelivery = new Date(createdDate);
            estimatedDelivery.setDate(estimatedDelivery.getDate() + 3); // 3 days estimate

            // Status messages
            const statusMessages: Record<string, string> = {
                pending: '⏳ Your order is being processed',
                confirmed: '✅ Order confirmed and being prepared',
                processing: '📦 Your order is being packed',
                shipped: '🚚 Order is out for delivery',
                delivered: '✓ Order delivered successfully',
                cancelled: '❌ Order has been cancelled'
            };

            res.json({
                success: true,
                order: {
                    id: order.id,
                    status: order.orderStatus,
                    statusMessage: statusMessages[order.orderStatus] || order.orderStatus,
                    paymentStatus: order.paymentStatus,
                    paymentMethod: order.paymentMethod,
                    total: order.total,
                    itemCount: order.orderItems.length,
                    items: order.orderItems.map(item => ({
                        id: item.id,
                        productId: item.productId,
                        name: item.product.title,
                        quantity: item.quantity,
                        price: item.price,
                        image: (() => {
                            try {
                                const images = JSON.parse(item.product.images || '[]');
                                return images.length > 0 ? images[0] : null;
                            } catch (e) { return null; }
                        })()
                    })),
                    shippingAddress,
                    estimatedDelivery: order.orderStatus !== 'delivered' && order.orderStatus !== 'cancelled'
                        ? estimatedDelivery.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })
                        : null,
                    createdAt: order.createdAt,
                    lastPayment: order.payments[0] || null,
                    canCancel: order.orderStatus === 'pending',
                    hasOTP: !!order.otp
                }
            });
        } catch (error) {
            console.error('Order status error:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to fetch order status'
            });
        }
    },

    /**
     * GET /api/chatbot/product-info/:productId
     * Quick product info lookup for chatbot
     */
    async getProductInfo(req: Request, res: Response) {
        try {
            const { productId } = req.params;
            const productIdNum = parseInt(productId || '0');

            if (isNaN(productIdNum) || productIdNum === 0) {
                return res.status(400).json({
                    success: false,
                    message: 'Invalid product ID format'
                });
            }

            const product = await prismaClient.product.findUnique({
                where: { id: productIdNum },
                include: {
                    category: true,
                    reviews: {
                        where: { approvalStatus: 'approved' },
                        select: { rating: true }
                    }
                }
            });

            if (!product) {
                return res.status(404).json({
                    success: false,
                    message: 'Product not found'
                });
            }

            // Calculate average rating
            const avgRating = product.reviews.length > 0
                ? product.reviews.reduce((sum, r) => sum + r.rating, 0) / product.reviews.length
                : 0;

            // Parse images
            let images: string[] = [];
            try {
                images = JSON.parse(product.images || '[]');
            } catch (e) {
                images = [];
            }

            // Determine stock status
            let stockStatus = 'In Stock';
            let stockColor = 'green';
            if (product.stock === 0) {
                stockStatus = 'Out of Stock';
                stockColor = 'red';
            } else if (product.stock < 10) {
                stockStatus = `Only ${product.stock} left - Order soon!`;
                stockColor = 'orange';
            }

            res.json({
                success: true,
                product: {
                    id: product.id,
                    sku: product.sku,
                    title: product.title,
                    description: product.description.substring(0, 300) + (product.description.length > 300 ? '...' : ''),
                    price: product.price,
                    mrp: product.mrp,
                    discount: product.mrp > product.price
                        ? Math.round(((product.mrp - product.price) / product.mrp) * 100)
                        : 0,
                    stock: product.stock,
                    stockStatus,
                    stockColor,
                    isAvailable: product.isActive && product.stock > 0,
                    category: product.category.name,
                    categoryId: product.categoryId,
                    images,
                    primaryImage: images[0] || null,
                    rating: Math.round(avgRating * 10) / 10,
                    reviewCount: product.reviews.length,
                    slug: product.slug
                }
            });
        } catch (error) {
            console.error('Product info error:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to fetch product info'
            });
        }
    },

    /**
     * POST /api/customer-service/process
     * Process message through customer service AI
     */
    async processMessage(req: AuthRequest, res: Response) {
        try {
            const { message, sessionId } = req.body;
            const userId = req.user?.id;

            if (!message) {
                return res.status(400).json({
                    success: false,
                    message: 'Message is required'
                });
            }

            const result = await customerServiceManager.processMessage(
                message,
                sessionId || `session_${Date.now()}`,
                userId
            );

            res.json({
                success: true,
                ...result
            });
        } catch (error) {
            console.error('Customer service error:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to process message'
            });
        }
    },

    /**
     * POST /api/customer-service/escalate
     * Manually escalate to human agent
     */
    async escalateToHuman(req: AuthRequest, res: Response) {
        try {
            const { sessionId, reason } = req.body;
            const userId = req.user?.id;

            if (!sessionId) {
                return res.status(400).json({
                    success: false,
                    message: 'Session ID is required'
                });
            }

            const ticket = await customerServiceManager.createEscalationTicket(
                sessionId,
                userId,
                reason || 'Customer requested human support',
                { sentiment: 'neutral', score: 0, shouldEscalate: true, keywords: [] }
            );

            res.json({
                success: true,
                message: 'Escalation ticket created',
                ticket
            });
        } catch (error) {
            console.error('Escalation error:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to create escalation ticket'
            });
        }
    },

    /**
     * POST /api/customer-service/feedback
     * Submit satisfaction rating
     */
    async submitFeedback(req: AuthRequest, res: Response) {
        try {
            const { sessionId, rating, comment } = req.body;
            const userId = req.user?.id;

            if (!sessionId || !rating || rating < 1 || rating > 5) {
                return res.status(400).json({
                    success: false,
                    message: 'Valid session ID and rating (1-5) are required'
                });
            }

            const response = await customerServiceManager.processSatisfactionRating(
                rating,
                sessionId,
                userId
            );

            res.json({
                success: true,
                message: response
            });
        } catch (error) {
            console.error('Feedback error:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to submit feedback'
            });
        }
    },

    /**
     * GET /api/customer-service/tickets
     * Get active support tickets (Admin only)
     */
    async getTickets(req: AuthRequest, res: Response) {
        try {
            if (req.user?.role !== 'admin' && req.user?.role !== 'ADMIN') {
                return res.status(403).json({
                    success: false,
                    message: 'Admin access required'
                });
            }

            const { status, priority, limit } = req.query;

            let whereClause: any = {};
            if (status) {
                whereClause.status = status;
            }
            if (priority) {
                whereClause.priority = priority;
            }

            const tickets = await prismaClient.supportTicket.findMany({
                where: whereClause,
                orderBy: [
                    { priority: 'asc' },
                    { createdAt: 'asc' }
                ],
                take: parseInt(limit as string) || 50,
                include: {
                    user: {
                        select: { id: true, name: true, email: true, phone: true }
                    },
                    agent: {
                        select: { id: true, name: true }
                    }
                }
            });

            res.json({
                success: true,
                tickets,
                count: tickets.length
            });
        } catch (error) {
            console.error('Get tickets error:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to fetch tickets'
            });
        }
    },

    /**
     * PUT /api/customer-service/tickets/:id
     * Update support ticket (Admin only)
     */
    async updateTicket(req: AuthRequest, res: Response) {
        try {
            if (req.user?.role !== 'admin' && req.user?.role !== 'ADMIN') {
                return res.status(403).json({
                    success: false,
                    message: 'Admin access required'
                });
            }

            const { id } = req.params;
            const { status, assignedTo, resolution } = req.body;

            const updateData: any = {};
            if (status) updateData.status = status;
            if (assignedTo) updateData.assignedTo = parseInt(assignedTo);
            if (resolution) updateData.resolution = resolution;
            if (status === 'resolved') updateData.resolvedAt = new Date();

            const ticket = await prismaClient.supportTicket.update({
                where: { id: parseInt(id || '0') },
                data: updateData,
                include: {
                    user: { select: { id: true, name: true, email: true } },
                    agent: { select: { id: true, name: true } }
                }
            });

            res.json({
                success: true,
                message: 'Ticket updated',
                ticket
            });
        } catch (error) {
            console.error('Update ticket error:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to update ticket'
            });
        }
    },

    /**
     * GET /api/customer-service/statistics
     * Get customer service statistics (Admin only)
     */
    async getStatistics(req: AuthRequest, res: Response) {
        try {
            if (req.user?.role !== 'admin' && req.user?.role !== 'ADMIN') {
                return res.status(403).json({
                    success: false,
                    message: 'Admin access required'
                });
            }

            const stats = await customerServiceManager.getStatistics();

            // Additional metrics
            const last24h = new Date();
            last24h.setHours(last24h.getHours() - 24);

            const [ticketsToday, resolvedToday, avgResponseTime] = await Promise.all([
                prismaClient.supportTicket.count({
                    where: { createdAt: { gte: last24h } }
                }),
                prismaClient.supportTicket.count({
                    where: {
                        resolvedAt: { gte: last24h }
                    }
                }),
                prismaClient.supportTicket.aggregate({
                    where: { status: 'resolved' },
                    _avg: {
                        // This would need actual response time tracking
                    }
                })
            ]);

            res.json({
                success: true,
                statistics: {
                    ...stats,
                    ticketsToday,
                    resolvedToday,
                    resolutionRate: ticketsToday > 0
                        ? Math.round((resolvedToday / ticketsToday) * 100)
                        : 100
                }
            });
        } catch (error) {
            console.error('Statistics error:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to fetch statistics'
            });
        }
    },

    /**
     * GET /api/customer-service/survey
     * Get satisfaction survey prompt
     */
    async getSurvey(req: Request, res: Response) {
        try {
            const survey = customerServiceManager.generateSatisfactionSurvey();
            res.json({
                success: true,
                survey
            });
        } catch (error) {
            console.error('Survey error:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to generate survey'
            });
        }
    }
};
