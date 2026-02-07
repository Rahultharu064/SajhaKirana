interface UserPreferences {
    priceRange?: {
        min: number;
        max: number;
    };
    favoriteCategories?: string[];
    purchaseHistory?: any[];
    itemsSkus?: string[];
}
export declare class RecommendationService {
    getUserPreferences(userId: number): Promise<UserPreferences>;
    recommendProducts(userId: number, limit?: number): Promise<any[]>;
    getSimilarProducts(productId: number, limit?: number): Promise<any[]>;
    getTrendingProducts(limit?: number): Promise<any[]>;
    getBudgetProducts(maxPrice: number, limit?: number): Promise<any[]>;
}
export declare const recommendationService: RecommendationService;
export {};
//# sourceMappingURL=recommendationService.d.ts.map