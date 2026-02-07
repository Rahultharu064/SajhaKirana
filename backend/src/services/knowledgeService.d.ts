export declare class KnowledgeService {
    indexProducts(): Promise<void>;
    indexCategories(): Promise<void>;
    indexPlatformKnowledge(): Promise<void>;
    indexAll(): Promise<void>;
    updateProduct(productId: string | number): Promise<void>;
    deleteProduct(productId: string | number): Promise<void>;
}
export declare const knowledgeService: KnowledgeService;
//# sourceMappingURL=knowledgeService.d.ts.map