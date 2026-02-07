export interface SearchResult {
    productId: number;
    title: string;
    price: number;
    mrp: number;
    image: string | null;
    avgRating: number;
    stock: number;
    score: number;
    relevanceScore: number;
    metadata: any;
}
export declare class IntelligentSearchService {
    private llm;
    constructor();
    /**
     * Intelligent Search with Semantic Retrieval and Custom Ranking
     */
    search(query: string, options?: {
        userId?: number;
        sessionId?: string;
        limit?: number;
    }): Promise<SearchResult[]>;
    /**
     * Smart Autocomplete with Typo Correction and Intent Detection
     */
    getSuggestions(query: string): Promise<any>;
}
export declare const intelligentSearchService: IntelligentSearchService;
//# sourceMappingURL=intelligentSearchService.d.ts.map