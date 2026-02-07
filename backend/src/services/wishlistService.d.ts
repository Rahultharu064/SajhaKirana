export declare const wishlistService: {
    addToWishlist: (userId: number, productId: number) => Promise<{
        success: boolean;
        message: string;
        wishlist: {
            id: number;
            createdAt: Date;
            productId: number;
            userId: number;
        };
    }>;
    removeFromWishlist: (userId: number, productId: number) => Promise<{
        success: boolean;
        message: string;
    }>;
    getUserWishlist: (userId: number) => Promise<{
        success: boolean;
        data: ({
            product: {
                id: number;
                slug: string;
                category: {
                    name: string;
                    slug: string;
                };
                title: string;
                price: number;
                mrp: number;
                stock: number;
                isActive: boolean;
                images: string;
            };
        } & {
            id: number;
            createdAt: Date;
            productId: number;
            userId: number;
        })[];
    }>;
    checkIsWishlisted: (userId: number, productId: number) => Promise<{
        isWishlisted: boolean;
    }>;
};
//# sourceMappingURL=wishlistService.d.ts.map