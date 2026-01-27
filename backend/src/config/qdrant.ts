import { QdrantClient } from '@qdrant/js-client-rest';

const QDRANT_URL = process.env.QDRANT_URL || 'http://localhost:6333';
const QDRANT_API_KEY = process.env.QDRANT_API_KEY || '';

export const qdrantClient = new QdrantClient({
  url: QDRANT_URL,
  apiKey: QDRANT_API_KEY,
});

// Changed name to force recreation with new 384 dimensions
export const COLLECTION_NAME = 'sajha_kirana_local_v1';

// Initialize Qdrant collection
export async function initializeQdrantCollection() {
  try {
    const collections = await qdrantClient.getCollections();
    const collectionExists = collections.collections.some(
      (col) => col.name === COLLECTION_NAME
    );

    if (!collectionExists) {
      console.log(`📡 Creating fresh collection: ${COLLECTION_NAME} (384 dims)...`);
      await qdrantClient.createCollection(COLLECTION_NAME, {
        vectors: {
          size: 384, // Standard size for all-MiniLM-L6-v2
          distance: 'Cosine',
        },
      });
      console.log(`✅ Created Qdrant collection: ${COLLECTION_NAME}`);
    }

    // Ensure indexes for filtering exist (idempotent)
    console.log('📑 Syncing payload indexes...');
    const indexFields = [
      { name: 'type', schema: 'keyword' as const },
      { name: 'isAvailable', schema: 'bool' as const },
      { name: 'isActive', schema: 'bool' as const },
      { name: 'price', schema: 'float' as const },
    ];

    for (const field of indexFields) {
      try {
        // We drop and recreate to ensure the type is correct if it changed
        try {
          await qdrantClient.deletePayloadIndex(COLLECTION_NAME, field.name);
        } catch (e) {
          // Ignore if it doesn't exist
        }

        await qdrantClient.createPayloadIndex(COLLECTION_NAME, {
          field_name: field.name,
          field_schema: field.schema,
        });
        console.log(`✅ Index created for: ${field.name} (${field.schema})`);
      } catch (e: any) {
        console.warn(`⚠️ Could not create index for ${field.name}:`, e.message);
      }
    }

    console.log(`✅ Qdrant collection and indexes ready: ${COLLECTION_NAME}`);
  } catch (error) {
    console.error('❌ Error initializing Qdrant:', error);
    throw error;
  }
}
