import app from "./app";
import { prismaClient } from "./config/client";
import http from "http";
import { initSocket } from "./utils/socket";
import { initializeQdrantCollection } from "./config/qdrant";
import { knowledgeService } from "./services/knowledgeService";
import { redis } from "./config/redis";

/**
 * Sajha Kirana - Main Server
 * This file handles database connection, service initialization, 
 * socket setup, and graceful shutdown.
 */

const server = http.createServer(app);
const PORT = process.env.PORT || 5003;

// Initialize Socket.IO
initSocket(server);

/**
 * Initialize all external services (Qdrant, Knowledge Base, etc.)
 */
async function initializeServices() {
  try {
    console.log('🧪 Initializing background services...');

    // Step 1: Initialize Qdrant Collection
    await initializeQdrantCollection();
    console.log('✅ Qdrant database ready');

    // Step 2: Index all knowledge
    // This ensures the AI assistant has the latest product and platform data
    console.log('🔄 Syncing knowledge base with vector database...');
    await knowledgeService.indexAll();

    console.log('✅ Chatbot knowledge sync completed successfully');
    console.log('🎉 AI Assistant is ready to help users!');
  } catch (error) {
    console.error('❌ Service initialization failed:', error);
    console.log('⚠️  The chatbot might have limited functionality.');
  }
}

/**
 * Start the server
 */
server.listen(PORT, async () => {
  try {
    console.log('--- Startup Phase ---');

    // 1. Database Connection
    await prismaClient.$connect();
    console.log(`✅ Database connected successfully`);

    // 2. Redis Connection Check
    if (redis.status === 'ready') {
      console.log('✅ Redis connected successfully');
    } else {
      console.log(`⏳ Redis Status: ${redis.status}...`);
    }

    // 3. Service Initializations
    // We run this in the background so a Qdrant/Knowledge sync failure 
    // doesn't take down the entire API server.
    initializeServices().catch(err => {
      console.error('⚠️ Background service initialization failed:', err.message);
    });

    console.log('---------------------');
    console.log(`🚀 Server is running on port ${PORT}`);
    console.log(`📡 WebSocket server is enabled`);
    console.log(`🏠 Application URL: http://localhost:${PORT}`);
  } catch (error) {
    console.error('❌ Server failed to start:', error);
    process.exit(1);
  }
});

/**
 * Graceful Shutdown Handling
 * Ensures active connections are closed properly before exiting
 */
const handleShutdown = async (signal: string) => {
  console.log(`\nReceived ${signal}. Starting graceful shutdown...`);

  // Close server first (stop accepting new requests)
  server.close(async () => {
    console.log('🛑 HTTP server stopped');

    try {
      // Close Database
      await prismaClient.$disconnect();
      console.log('✅ Database connections closed');

      // Close Redis
      await redis.quit();
      console.log('✅ Redis connection closed');

      console.log('👋 Shutdown complete. Goodbye!');
      process.exit(0);
    } catch (err) {
      console.error('❌ Error during cleanup:', err);
      process.exit(1);
    }
  });

  // Force close after 10 seconds if graceful shutdown fails
  setTimeout(() => {
    console.error('⚠️ Graceful shutdown timed out. Forcefully exiting...');
    process.exit(1);
  }, 10000);
};

process.on('SIGTERM', () => handleShutdown('SIGTERM'));
process.on('SIGINT', () => handleShutdown('SIGINT'));
