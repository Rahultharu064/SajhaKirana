import { QdrantClient } from '@qdrant/js-client-rest';

const QDRANT_URL = process.env.QDRANT_URL || 'http://localhost:6333';
const QDRANT_API_KEY = process.env.QDRANT_API_KEY;

if (!QDRANT_URL) {
  throw new Error('QDRANT_URL is not defined in the environment');
}   

export const qdrantClient = new QdrantClient({
  url: QDRANT_URL,
  apiKey: QDRANT_API_KEY,
} as any);

export const COLLECTION_NAME = 'sajha_kirana_knowledge';

// Initialize Qdrant collection
export async function initializeQdrantCollection() {
  try {
    const collections = await qdrantClient.getCollections();
    const collectionExists = collections.collections.some(
      (col) => col.name === COLLECTION_NAME
    );

    if (!collectionExists) {
      await qdrantClient.createCollection(COLLECTION_NAME, {
        vectors: {
          size: 1536, // OpenAI embedding size
          distance: 'Cosine',
        },
      });
      console.log(`✅ Created Qdrant collection: ${COLLECTION_NAME}`);
    } else {
      console.log(`✅ Qdrant collection already exists: ${COLLECTION_NAME}`);
    }
  } catch (error) {
    console.error('❌ Error initializing Qdrant:', error);
    throw error;
  }
}