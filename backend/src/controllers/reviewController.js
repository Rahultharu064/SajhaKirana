import { PrismaClient } from '@prisma/client';
import { deleteImageFile } from '../config/multer';
import jwt from 'jsonwebtoken';
const prisma = new PrismaClient();
// Create a new review
export const createReview = async (req, res) => {
    try {
        const userId = req.user?.userId;
        const { productId, rating, comment } = req.body;
        if (!userId) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        // Check if product exists
        const product = await prisma.product.findUnique({
            where: { id: parseInt(productId) }
        });
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        // Check if user already reviewed this product
        const existingReview = await prisma.review.findFirst({
            where: {
                userId,
                productId: parseInt(productId)
            }
        });
        if (existingReview) {
            return res.status(409).json({ message: 'You have already reviewed this product' });
        }
        // Create review
        const review = await prisma.review.create({
            data: {
                userId,
                productId: parseInt(productId),
                rating: parseInt(rating),
                comment,
                approvalStatus: 'pending'
            },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        profileImage: true
                    }
                },
                product: {
                    select: {
                        id: true,
                        title: true,
                        slug: true
                    }
                }
            }
        });
        // Handle media uploads if any
        if (req.files && Array.isArray(req.files) && req.files.length > 0) {
            const mediaFiles = req.files;
            for (const file of mediaFiles) {
                const mediaType = file.mimetype.startsWith('video/') ? 'video' : 'image';
                await prisma.reviewMedia.create({
                    data: {
                        reviewId: review.id,
                        mediaType,
                        mediaUrl: file.filename,
                        fileSize: file.size,
                        mimeType: file.mimetype
                    }
                });
            }
        }
        // Fetch the complete review with media
        const completeReview = await prisma.review.findUnique({
            where: { id: review.id },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        profileImage: true
                    }
                },
                product: {
                    select: {
                        id: true,
                        title: true,
                        slug: true
                    }
                },
                media: true
            }
        });
        res.status(201).json({
            message: 'Review submitted successfully and is pending approval',
            data: completeReview
        });
    }
    catch (error) {
        console.error('Create review error:', error);
        if (error.code === 'P2002') {
            return res.status(409).json({ message: 'You have already reviewed this product' });
        }
        res.status(500).json({ message: 'Failed to create review', error: error.message });
    }
};
// Get reviews for a product
export const getReviewsByProduct = async (req, res) => {
    try {
        const { productId } = req.params;
        const productIdNum = parseInt(productId);
        const page = parseInt(req.query.page || '1');
        const limit = parseInt(req.query.limit || '10');
        const sort = req.query.sort || 'newest';
        const ratingStr = req.query.rating;
        const skip = (page - 1) * limit;
        const take = limit;
        // Check for optional authentication to show user's own non-approved reviews
        let currentUserId = null;
        const authHeader = req.headers.authorization;
        if (typeof authHeader === 'string' && authHeader.startsWith("Bearer ")) {
            try {
                const token = authHeader.split(" ")[1] || "";
                const secret = process.env.JWT_SECRET || "your_jwt_secret_key";
                const decoded = jwt.verify(token, secret);
                currentUserId = decoded.userId;
            }
            catch (err) {
                // Ignore invalid tokens for public route
            }
        }
        // Build where clause
        const where = {
            productId: productIdNum,
            OR: [
                { approvalStatus: 'approved' },
                ...(currentUserId ? [{ userId: currentUserId, approvalStatus: 'pending' }] : [])
            ]
        };
        if (ratingStr) {
            where.rating = parseInt(ratingStr);
        }
        // Build orderBy clause
        let orderBy = {};
        switch (sort) {
            case 'oldest':
                orderBy = { createdAt: 'asc' };
                break;
            case 'highest':
                orderBy = { rating: 'desc' };
                break;
            case 'lowest':
                orderBy = { rating: 'asc' };
                break;
            case 'newest':
            default:
                orderBy = { createdAt: 'desc' };
        }
        const [reviews, total] = await Promise.all([
            prisma.review.findMany({
                where,
                skip,
                take,
                orderBy,
                include: {
                    user: {
                        select: {
                            id: true,
                            name: true,
                            email: true,
                            profileImage: true
                        }
                    },
                    media: true
                }
            }),
            prisma.review.count({ where })
        ]);
        // Calculate stats
        const allReviews = await prisma.review.findMany({
            where: {
                productId: productIdNum,
                approvalStatus: 'approved'
            },
            select: { rating: true }
        });
        const totalReviews = allReviews.length;
        const averageRating = totalReviews > 0
            ? allReviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews
            : 0;
        const ratingDistribution = allReviews.reduce((acc, r) => {
            acc[r.rating] = (acc[r.rating] || 0) + 1;
            return acc;
        }, {});
        res.json({
            data: reviews,
            pagination: {
                total,
                page,
                limit,
                pages: Math.ceil(total / limit)
            },
            stats: {
                total: totalReviews,
                averageRating,
                ratingDistribution
            }
        });
    }
    catch (error) {
        console.error('Get reviews error:', error);
        res.status(500).json({ message: 'Failed to fetch reviews', error: error.message });
    }
};
// Get user's reviews
export const getMyReviews = async (req, res) => {
    try {
        const userId = req.user?.userId;
        const page = parseInt(req.query.page || '1');
        const limit = parseInt(req.query.limit || '10');
        const sort = req.query.sort || 'newest';
        if (!userId) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        const skip = (page - 1) * limit;
        const take = limit;
        let orderBy = {};
        switch (sort) {
            case 'oldest':
                orderBy = { createdAt: 'asc' };
                break;
            case 'highest':
                orderBy = { rating: 'desc' };
                break;
            case 'lowest':
                orderBy = { rating: 'asc' };
                break;
            case 'newest':
            default:
                orderBy = { createdAt: 'desc' };
        }
        const [reviews, total] = await Promise.all([
            prisma.review.findMany({
                where: { userId },
                skip,
                take,
                orderBy,
                include: {
                    product: {
                        select: {
                            id: true,
                            title: true,
                            slug: true,
                            images: true
                        }
                    },
                    media: true
                }
            }),
            prisma.review.count({ where: { userId } })
        ]);
        res.json({
            data: reviews,
            pagination: {
                total,
                page,
                limit,
                pages: Math.ceil(total / limit)
            }
        });
    }
    catch (error) {
        console.error('Get my reviews error:', error);
        res.status(500).json({ message: 'Failed to fetch reviews', error: error.message });
    }
};
// Update review
export const updateReview = async (req, res) => {
    try {
        const userId = req.user?.userId;
        const { id } = req.params;
        const { rating, comment } = req.body;
        if (!userId) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        // Check if review exists and belongs to user
        const review = await prisma.review.findUnique({
            where: { id: parseInt(id) }
        });
        if (!review) {
            return res.status(404).json({ message: 'Review not found' });
        }
        if (review.userId !== userId) {
            return res.status(403).json({ message: 'You can only update your own reviews' });
        }
        // Update review
        const updatedReview = await prisma.review.update({
            where: { id: parseInt(id) },
            data: {
                ...(rating !== undefined && { rating: parseInt(rating) }),
                ...(comment !== undefined && { comment }),
                approvalStatus: 'pending' // Reset to pending after edit
            },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        profileImage: true
                    }
                },
                product: {
                    select: {
                        id: true,
                        title: true,
                        slug: true
                    }
                },
                media: true
            }
        });
        res.json({
            message: 'Review updated successfully and is pending approval',
            data: updatedReview
        });
    }
    catch (error) {
        console.error('Update review error:', error);
        res.status(500).json({ message: 'Failed to update review', error: error.message });
    }
};
// Delete review
export const deleteReview = async (req, res) => {
    try {
        const userId = req.user?.userId;
        const { id } = req.params;
        if (!userId) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        // Check if review exists and belongs to user
        const review = await prisma.review.findUnique({
            where: { id: parseInt(id) },
            include: { media: true }
        });
        if (!review) {
            return res.status(404).json({ message: 'Review not found' });
        }
        if (review.userId !== userId) {
            return res.status(403).json({ message: 'You can only delete your own reviews' });
        }
        // Delete associated media files
        for (const media of review.media) {
            deleteImageFile(media.mediaUrl, 'reviews');
        }
        // Delete review (will cascade delete media records)
        await prisma.review.delete({
            where: { id: parseInt(id) }
        });
        res.json({ message: 'Review deleted successfully' });
    }
    catch (error) {
        console.error('Delete review error:', error);
        res.status(500).json({ message: 'Failed to delete review', error: error.message });
    }
};
// Admin: Get pending reviews
export const getPendingReviews = async (req, res) => {
    try {
        const page = parseInt(req.query.page || '1');
        const limit = parseInt(req.query.limit || '10');
        const skip = (page - 1) * limit;
        const take = limit;
        const [reviews, total] = await Promise.all([
            prisma.review.findMany({
                where: { approvalStatus: 'pending' },
                skip,
                take,
                orderBy: { createdAt: 'desc' },
                include: {
                    user: {
                        select: {
                            id: true,
                            name: true,
                            email: true,
                            profileImage: true
                        }
                    },
                    product: {
                        select: {
                            id: true,
                            title: true,
                            slug: true,
                            images: true
                        }
                    },
                    media: true
                }
            }),
            prisma.review.count({ where: { approvalStatus: 'pending' } })
        ]);
        res.json({
            data: reviews,
            pagination: {
                total,
                page,
                limit,
                pages: Math.ceil(total / limit)
            }
        });
    }
    catch (error) {
        console.error('Get pending reviews error:', error);
        res.status(500).json({ message: 'Failed to fetch pending reviews', error: error.message });
    }
};
// Admin: Approve review
export const approveReview = async (req, res) => {
    try {
        const { id } = req.params;
        const review = await prisma.review.update({
            where: { id: parseInt(id) },
            data: { approvalStatus: 'approved' },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true
                    }
                },
                product: {
                    select: {
                        id: true,
                        title: true
                    }
                }
            }
        });
        res.json({
            message: 'Review approved successfully',
            data: review
        });
    }
    catch (error) {
        console.error('Approve review error:', error);
        res.status(500).json({ message: 'Failed to approve review', error: error.message });
    }
};
// Admin: Reject review
export const rejectReview = async (req, res) => {
    try {
        const { id } = req.params;
        const { reason } = req.body;
        const review = await prisma.review.update({
            where: { id: parseInt(id) },
            data: {
                approvalStatus: 'rejected',
                ...(reason && { rejectionReason: reason })
            }
        });
        res.json({
            message: 'Review rejected successfully',
            data: review
        });
    }
    catch (error) {
        console.error('Reject review error:', error);
        res.status(500).json({ message: 'Failed to reject review', error: error.message });
    }
};
// Admin: Bulk approve reviews
export const bulkApproveReviews = async (req, res) => {
    try {
        const { reviewIds } = req.body;
        if (!Array.isArray(reviewIds) || reviewIds.length === 0) {
            return res.status(400).json({ message: 'Invalid review IDs' });
        }
        await prisma.review.updateMany({
            where: {
                id: { in: reviewIds.map((id) => parseInt(String(id))) }
            },
            data: { approvalStatus: 'approved' }
        });
        res.json({ message: `${reviewIds.length} reviews approved successfully` });
    }
    catch (error) {
        console.error('Bulk approve error:', error);
        res.status(500).json({ message: 'Failed to approve reviews', error: error.message });
    }
};
// Admin: Bulk reject reviews
export const bulkRejectReviews = async (req, res) => {
    try {
        const { reviewIds, reason } = req.body;
        if (!Array.isArray(reviewIds) || reviewIds.length === 0) {
            return res.status(400).json({ message: 'Invalid review IDs' });
        }
        await prisma.review.updateMany({
            where: {
                id: { in: reviewIds.map((id) => parseInt(String(id))) }
            },
            data: {
                approvalStatus: 'rejected',
                rejectionReason: reason || null
            }
        });
        res.json({ message: `${reviewIds.length} reviews rejected successfully` });
    }
    catch (error) {
        console.error('Bulk reject error:', error);
        res.status(500).json({ message: 'Failed to reject reviews', error: error.message });
    }
};
//# sourceMappingURL=reviewController.js.map