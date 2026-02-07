import type { Schemas } from '@qdrant/js-client-rest';
type QdrantFilter = Schemas['Filter'];
export declare class EmbeddingService {
    private extractor;
    /**
     * Initialize the local embedding model
     * Uses Xenova/all-MiniLM-L6-v2 (384 dimensions)
     */
    private getExtractor;
    generateEmbedding(text: string): Promise<number[]>;
    storeDocument(text: string, metadata: Record<string, any>): Promise<string>;
    searchSimilar(query: string, limit?: number, filter?: QdrantFilter): Promise<Array<{
        id: string | number;
        score: number;
        text?: string;
        metadata?: Record<string, any>;
    }>>;
    batchStoreDocuments(documents: Array<{
        text: string;
        metadata: Record<string, any>;
    }>): Promise<string[]>;
    deleteDocuments(filter: QdrantFilter): Promise<void>;
}
export declare const embeddingService: EmbeddingService;
export {};
//# sourceMappingURL=embeddingService.d.ts.map