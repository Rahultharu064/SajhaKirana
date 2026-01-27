import { PrismaClient } from '@prisma/client';
import { embeddingService } from './embeddingService';

const prisma = new PrismaClient();

interface UserPreferences {
    priceRange?: { min: number; max: number };
    favoriteCategories?: string[];
    purchaseHistory?: any[];
    itemsSkus?: string[];
}

export class RecommendationService {
    // Get user preferences from history
    async getUserPreferences(userId: number): Promise<UserPreferences> {
        try {
            // Get purchase history
            const orders = await prisma.order.findMany({
                where: { userId },
                include: {
                    orderItems: {
                        include: {
                            product: {
                                include: { category: true },
                            },
                        },
                    },
                },
                orderBy: { createdAt: 'desc' },
                take: 10,
            });

            // Calculate average spending
            const prices = orders.flatMap((o) =>
                o.orderItems.map((i) => i.product.price * i.quantity)
            );
            const avgSpending = prices.length > 0
                ? prices.reduce((a, b) => a + b, 0) / prices.length
                : 500;

            // Get favorite categories
            const categoryCount: Record<string, number> = {};
            orders.forEach((order) => {
                order.orderItems.forEach((item) => {
                    const catName = item.product.category?.name || 'Other';
                    categoryCount[catName] = (categoryCount[catName] || 0) + 1;
                });
            });

            const favoriteCategories = Object.entries(categoryCount)
                .sort(([, a], [, b]) => b - a)
                .slice(0, 3)
                .map(([cat]) => cat);

            // Get recently viewed products proxy
            const cart = await prisma.cartItem.findMany({
                where: { userId },
            });

            return {
                priceRange: {
                    min: Math.max(0, avgSpending * 0.5),
                    max: avgSpending * 2,
                },
                favoriteCategories,
                purchaseHistory: orders,
                itemsSkus: cart.map((c) => c.sku),
            };
        } catch (error) {
            console.error('Error getting user preferences:', error);
            return {};
        }
    }

    // Recommend products based on preferences
    async recommendProducts(
        userId: number,
        limit: number = 10
    ): Promise<any[]> {
        try {
            const preferences = await this.getUserPreferences(userId);

            // Build query for recommendations
            const whereConditions: any = {
                stock: { gt: 0 },
                isActive: true,
            };

            if (preferences.priceRange) {
                whereConditions.price = {
                    gte: preferences.priceRange.min,
                    lte: preferences.priceRange.max,
                };
            }

            if (preferences.favoriteCategories && preferences.favoriteCategories.length > 0) {
                whereConditions.category = {
                    name: { in: preferences.favoriteCategories },
                };
            }

            // Exclude already in cart
            if (preferences.itemsSkus && preferences.itemsSkus.length > 0) {
                whereConditions.sku = {
                    notIn: preferences.itemsSkus,
                };
            }

            const products = await prisma.product.findMany({
                where: whereConditions,
                include: {
                    category: true,
                    reviews: {
                        select: {
                            rating: true,
                        },
                    },
                },
                take: limit,
                orderBy: [
                    { stock: 'desc' }, // Prioritize in-stock items
                ],
            });

            // Calculate average rating for each product
            return products.map((p) => ({
                ...p,
                avgRating:
                    p.reviews.length > 0
                        ? p.reviews.reduce((sum, r) => sum + r.rating, 0) / p.reviews.length
                        : 0,
            }));
        } catch (error) {
            console.error('Error recommending products:', error);
            return [];
        }
    }

    // Get similar products based on description
    async getSimilarProducts(productId: number, limit: number = 5): Promise<any[]> {
        try {
            const product = await prisma.product.findUnique({
                where: { id: productId },
                include: { category: true },
            });

            if (!product) return [];

            const query = `${product.title} ${product.description || ''} ${product.category?.name || ''}`;

            const results = await embeddingService.searchSimilar(query, limit + 1, {
                must: [
                    { key: 'type', match: { value: 'product' } },
                ],
            });

            // Filter out the current product
            return results
                .filter((r) => r.metadata?.productId !== productId)
                .slice(0, limit);
        } catch (error) {
            console.error('Error getting similar products:', error);
            return [];
        }
    }

    // Get trending products
    async getTrendingProducts(limit: number = 10): Promise<any[]> {
        try {
            // Get products ordered most in last 30 days
            const thirtyDaysAgo = new Date();
            thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

            const trendingProducts = await prisma.orderItem.groupBy({
                by: ['productId'],
                _sum: {
                    quantity: true,
                },
                _count: {
                    productId: true,
                },
                where: {
                    order: {
                        createdAt: { gte: thirtyDaysAgo },
                    },
                },
                orderBy: {
                    _sum: {
                        quantity: 'desc',
                    },
                },
                take: limit,
            });

            const productIds = trendingProducts.map((t) => t.productId);

            const products = await prisma.product.findMany({
                where: {
                    id: { in: productIds },
                    stock: { gt: 0 },
                    isActive: true,
                },
                include: {
                    category: true,
                },
            });

            return products;
        } catch (error) {
            console.error('Error getting trending products:', error);
            return [];
        }
    }

    // Get budget-friendly products
    async getBudgetProducts(maxPrice: number, limit: number = 10): Promise<any[]> {
        try {
            return await prisma.product.findMany({
                where: {
                    price: { lte: maxPrice },
                    stock: { gt: 0 },
                    isActive: true,
                },
                include: {
                    category: true,
                },
                orderBy: [
                    { price: 'asc' },
                ],
                take: limit,
            });
        } catch (error) {
            console.error('Error getting budget products:', error);
            return [];
        }
    }
}

export const recommendationService = new RecommendationService();