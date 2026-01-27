import { QdrantClient } from '@qdrant/js-client-rest';

const QDRANT_URL = process.env.QDRANT_URL || 'http://localhost:6333';
const QDRANT_API_KEY = process.env.QDRANT_API_KEY || '';

export const qdrantClient = new QdrantClient({
  url: QDRANT_URL,
  apiKey: QDRANT_API_KEY,
});

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
          size: 1536,
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
