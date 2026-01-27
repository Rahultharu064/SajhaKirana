import app from "./app";
import { prismaClient } from "./config/client";
import http from "http"
import { initSocket } from "./utils/socket";
import { initializeQdrantCollection } from "../src/config/qdrant";
import { knowledgeService } from "../src/services/knowledgeService";
import { redis } from "./config/redis";

const server = http.createServer(app);
// Initialize Socket.IO
initSocket(server);

const PORT = process.env.PORT || 5003;
async function initializeServices() {
  try {
    await initializeQdrantCollection();
    console.log('✅ Qdrant initialized');
    // Step 2: Index all knowledge
    console.log('\nStep 2: Indexing knowledge base...');
    await knowledgeService.indexAll();

    console.log('\n✅ Chatbot initialization completed successfully!');
    console.log('🎉 Your AI chatbot is ready to use!');
  } catch (error) {
    console.error('❌ Failed to initialize services:', error);
  }
}



server.listen(PORT, async () => {
  try {
    await prismaClient.$connect()
    console.log(`✅ Database connected successfully`)

    // Wait for Redis connection (optional but good for logs)
    if (redis.status === 'connecting') {
      console.log('⏳ Connecting to Redis...');
    }

    // Call service initialization
    await initializeServices();

    console.log(`🚀 Server is running on port ${PORT}`)
  } catch (error) {
    console.error('❌ Startup failed:', error)
    console.log(`⚠️  Server is running on port ${PORT} with some issues`)
  }
})

