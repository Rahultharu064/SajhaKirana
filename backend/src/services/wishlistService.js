import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
export const wishlistService = {
    // Add item to wishlist
    addToWishlist: async (userId, productId) => {
        try {
            // Check if already exists
            const existing = await prisma.wishlist.findUnique({
                where: {
                    userId_productId: {
                        userId,
                        productId,
                    },
                },
            });
            if (existing) {
                return { success: true, message: 'Already in wishlist', wishlist: existing };
            }
            const wishlist = await prisma.wishlist.create({
                data: {
                    userId,
                    productId,
                },
                include: {
                    product: true
                }
            });
            return { success: true, message: 'Added to wishlist', wishlist };
        }
        catch (error) {
            console.error('Error adding to wishlist:', error);
            throw error;
        }
    },
    // Remove item from wishlist
    removeFromWishlist: async (userId, productId) => {
        try {
            await prisma.wishlist.delete({
                where: {
                    userId_productId: {
                        userId,
                        productId,
                    },
                },
            });
            return { success: true, message: 'Removed from wishlist' };
        }
        catch (error) {
            // If record doesn't exist, prisma throws generic error, but for delete we can ignore or handle
            console.error('Error removing from wishlist:', error);
            // Return success anyway as the end state is what we want
            return { success: true, message: 'Removed from wishlist' };
        }
    },
    // Get user's wishlist
    getUserWishlist: async (userId) => {
        try {
            const wishlist = await prisma.wishlist.findMany({
                where: { userId },
                include: {
                    product: {
                        select: {
                            id: true,
                            title: true,
                            slug: true,
                            price: true,
                            mrp: true,
                            images: true,
                            stock: true,
                            isActive: true,
                            category: {
                                select: {
                                    name: true,
                                    slug: true
                                }
                            }
                        }
                    }
                },
                orderBy: {
                    createdAt: 'desc'
                }
            });
            return { success: true, data: wishlist };
        }
        catch (error) {
            console.error('Error fetching wishlist:', error);
            throw error;
        }
    },
    // Check if product is in wishlist
    checkIsWishlisted: async (userId, productId) => {
        try {
            const item = await prisma.wishlist.findUnique({
                where: {
                    userId_productId: {
                        userId,
                        productId,
                    },
                },
            });
            return { isWishlisted: !!item };
        }
        catch (error) {
            console.error('Error checking wishlist status:', error);
            throw error;
        }
    }
};
//# sourceMappingURL=wishlistService.js.map