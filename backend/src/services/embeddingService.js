import { pipeline } from '@xenova/transformers';
import { qdrantClient, COLLECTION_NAME } from '../config/qdrant';
import { v4 as uuidv4 } from 'uuid';
export class EmbeddingService {
    extractor = null;
    /**
     * Initialize the local embedding model
     * Uses Xenova/all-MiniLM-L6-v2 (384 dimensions)
     */
    async getExtractor() {
        if (!this.extractor) {
            console.log('⏳ Loading local embedding model (free)...');
            this.extractor = await pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2');
            console.log('✅ Local embedding model loaded');
        }
        return this.extractor;
    }
    async generateEmbedding(text) {
        try {
            const extractor = await this.getExtractor();
            const output = await extractor(text, { pooling: 'mean', normalize: true });
            return Array.from(output.data);
        }
        catch (error) {
            console.error('Error generating local embedding:', error);
            throw error;
        }
    }
    async storeDocument(text, metadata) {
        try {
            const embedding = await this.generateEmbedding(text);
            const id = uuidv4();
            await qdrantClient.upsert(COLLECTION_NAME, {
                points: [
                    {
                        id,
                        vector: embedding,
                        payload: {
                            text,
                            ...metadata,
                            timestamp: new Date().toISOString(),
                        },
                    },
                ],
            });
            return id;
        }
        catch (error) {
            console.error('Error storing document:', error);
            throw error;
        }
    }
    async searchSimilar(query, limit = 5, filter) {
        try {
            const queryEmbedding = await this.generateEmbedding(query);
            const searchParams = {
                vector: queryEmbedding,
                limit,
                with_payload: true,
                ...(filter ? { filter } : {}),
            };
            const searchResult = await qdrantClient.search(COLLECTION_NAME, searchParams);
            return searchResult.map((result) => {
                const response = {
                    id: result.id,
                    score: result.score,
                };
                if (typeof result.payload?.text === 'string') {
                    response.text = result.payload.text;
                }
                if (result.payload) {
                    response.metadata = result.payload;
                }
                return response;
            });
        }
        catch (error) {
            console.error('Error searching similar documents:', error);
            throw error;
        }
    }
    async batchStoreDocuments(documents) {
        try {
            console.log(`📦 Batch processing ${documents.length} documents...`);
            const points = [];
            for (const doc of documents) {
                const embedding = await this.generateEmbedding(doc.text);
                const id = uuidv4();
                points.push({
                    id,
                    vector: embedding,
                    payload: {
                        text: doc.text,
                        ...doc.metadata,
                        timestamp: new Date().toISOString(),
                    },
                });
            }
            await qdrantClient.upsert(COLLECTION_NAME, { points });
            console.log('✅ Batch storage complete');
            return points.map((p) => p.id);
        }
        catch (error) {
            console.error('Error batch storing documents:', error);
            throw error;
        }
    }
    async deleteDocuments(filter) {
        try {
            await qdrantClient.delete(COLLECTION_NAME, { filter });
        }
        catch (error) {
            console.error('Error deleting documents:', error);
            throw error;
        }
    }
}
export const embeddingService = new EmbeddingService();
//# sourceMappingURL=embeddingService.js.map