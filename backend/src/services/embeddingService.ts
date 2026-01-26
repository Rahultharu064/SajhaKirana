import { OpenAIEmbeddings } from '@langchain/openai';
import { qdrantClient, COLLECTION_NAME } from '../config/qdrant';
import { v4 as uuidv4 } from 'uuid';

export class EmbeddingService {
    private embeddings: OpenAIEmbeddings;

    constructor() {
        this.embeddings = new OpenAIEmbeddings({
            openAIApiKey: process.env.OPENAI_API_KEY,
            modelName: 'text-embedding-3-small', // Cheaper and faster
        });
    }

    // Generate embedding for text
    async generateEmbedding(text: string): Promise<number[]> {
        try {
            const embedding = await this.embeddings.embedQuery(text);
            return embedding;
        } catch (error) {
            console.error('Error generating embedding:', error);
            throw error;
        }
    }

    // Store document in Qdrant
    async storeDocument(
        text: string,
        metadata: Record<string, any>
    ): Promise<string> {
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
        } catch (error) {
            console.error('Error storing document:', error);
            throw error;
        }
    }

    // Search similar documents
    async searchSimilar(
        query: string,
        limit: number = 5,
        filter?: Record<string, any>
    ): Promise<any[]> {
        try {
            const queryEmbedding = await this.generateEmbedding(query);

            const searchParams: any = {
                vector: queryEmbedding,
                limit,
                with_payload: true,
            };

            if (filter) {
                searchParams.filter = filter;
            }

            const searchResult = await qdrantClient.search(COLLECTION_NAME, searchParams);

            return searchResult.map((result) => ({
                id: result.id,
                score: result.score,
                text: result.payload?.text,
                metadata: result.payload,
            }));
        } catch (error) {
            console.error('Error searching similar documents:', error);
            throw error;
        }
    }

    // Batch store documents
    async batchStoreDocuments(
        documents: Array<{ text: string; metadata: Record<string, any> }>
    ): Promise<string[]> {
        try {
            const points = await Promise.all(
                documents.map(async (doc) => {
                    const embedding = await this.generateEmbedding(doc.text);
                    const id = uuidv4();

                    return {
                        id,
                        vector: embedding,
                        payload: {
                            text: doc.text,
                            ...doc.metadata,
                            timestamp: new Date().toISOString(),
                        },
                    };
                })
            );

            await qdrantClient.upsert(COLLECTION_NAME, {
                points,
            });

            return points.map((p) => p.id);
        } catch (error) {
            console.error('Error batch storing documents:', error);
            throw error;
        }
    }

    // Delete documents by filter
    async deleteDocuments(filter: Record<string, any>): Promise<void> {
        try {
            await qdrantClient.delete(COLLECTION_NAME, {
                filter,
            });
        } catch (error) {
            console.error('Error deleting documents:', error);
            throw error;
        }
    }
}

export const embeddingService = new EmbeddingService();
