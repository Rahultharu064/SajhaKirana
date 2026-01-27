import { OpenAIEmbeddings } from '@langchain/openai';
import { qdrantClient, COLLECTION_NAME } from '../config/qdrant';
import { v4 as uuidv4 } from 'uuid';
import type { Schemas } from '@qdrant/js-client-rest';

type QdrantFilter = Schemas['Filter'];

export class EmbeddingService {
  private embeddings: OpenAIEmbeddings;

  constructor() {
    this.embeddings = new OpenAIEmbeddings({
      openAIApiKey: process.env.OPENAI_API_KEY,
      modelName: 'text-embedding-3-small',
    });
  }

  async generateEmbedding(text: string): Promise<number[]> {
    try {
      return await this.embeddings.embedQuery(text);
    } catch (error) {
      console.error('Error generating embedding:', error);
      throw error;
    }
  }

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

 async searchSimilar(
  query: string,
  limit: number = 5,
  filter?: QdrantFilter
): Promise<
  Array<{
    id: string | number;
    score: number;
    text?: string;
    metadata?: Record<string, any>;
  }>
> {
  try {
    const queryEmbedding = await this.generateEmbedding(query);

    const searchParams = {
      vector: queryEmbedding,
      limit,
      with_payload: true,
      ...(filter ? { filter } : {}),
    };

    const searchResult = await qdrantClient.search(
      COLLECTION_NAME,
      searchParams
    );

    return searchResult.map((result) => {
      const response: {
        id: string | number;
        score: number;
        text?: string;
        metadata?: Record<string, any>;
      } = {
        id: result.id,
        score: result.score,
      };

      if (typeof result.payload?.text === 'string') {
        response.text = result.payload.text;
      }

      if (result.payload) {
        response.metadata = result.payload as Record<string, any>;
      }

      return response;
    });
  } catch (error) {
    console.error('Error searching similar documents:', error);
    throw error;
  }
}

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

      await qdrantClient.upsert(COLLECTION_NAME, { points });

      return points.map((p) => p.id);
    } catch (error) {
      console.error('Error batch storing documents:', error);
      throw error;
    }
  }

  async deleteDocuments(filter: QdrantFilter): Promise<void> {
    try {
      await qdrantClient.delete(COLLECTION_NAME, { filter });
    } catch (error) {
      console.error('Error deleting documents:', error);
      throw error;
    }
  }
}

export const embeddingService = new EmbeddingService();