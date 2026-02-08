import "dotenv/config"; // Ensure env vars are loaded first
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
const PORT = parseInt(process.env.PORT || "5003");

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
    // We only run this if NOT in a build environment (optional check)
    if (process.env.NODE_ENV !== 'test') {
      console.log('🔄 Syncing knowledge base with vector database...');
      // This is a heavy operation, so we ensure it doesn't block the initial server response
      await knowledgeService.indexAll();
      console.log('✅ Chatbot knowledge sync completed successfully');
      console.log('🎉 AI Assistant is ready to help users!');
    }
  } catch (error) {
    console.error('❌ Service initialization failed:', error);
    console.log('⚠️  The chatbot might have limited functionality.');
  }
}

/**
 * Start the server
 */
// Bind to 0.0.0.0 to ensure Docker/Railway compatibility
server.listen(PORT, "0.0.0.0", async () => {
  console.log('--- Startup Phase ---');
  console.log(`🚀 Server is running on port ${PORT}`);
  console.log(`🏠 Application URL: http://0.0.0.0:${PORT}`);

  // Log environment status (redacted)
  console.log(`Resource Status:`);
  console.log(`- Database URL Provided: ${!!process.env.DATABASE_URL}`);
  console.log(`- Redis URL Provided: ${!!process.env.REDIS_URL}`);
  console.log(`- Qdrant URL Provided: ${!!process.env.QDRANT_URL}`);
  console.log(`- GROQ API Key Provided: ${!!process.env.GROQ_API_KEY}`);


  // 1. Database Connection with Retry Logic
  const connectWithRetry = async (retries = 10, delay = 5000) => {
    for (let i = 0; i < retries; i++) {
      try {
        await prismaClient.$connect();
        console.log(`✅ Database connected successfully`);
        return;
      } catch (err: any) {
        console.error(`❌ Database connection failed (Attempt ${i + 1}/${retries}):`, err.message);
        if (i === retries - 1) throw err;
        console.log(`⏳ Retrying in ${delay / 1000} seconds...`);
        await new Promise(res => setTimeout(res, delay));
      }
    }
  };

  console.log('Using DATABASE_URL:', process.env.DATABASE_URL ? '[REDACTED]' : 'MISSING');
  await connectWithRetry();

  // 2. Redis Connection Check
  if (redis.status === 'ready') {
    console.log('✅ Redis connected successfully');
  } else {
    console.log(`⏳ Redis Status: ${redis.status}...`);
  }

  // 3. Service Initializations
  // We delay this slightly to let the server fully stabilize and pass initial health checks
  setTimeout(() => {
    console.log('⏰ Starting delayed background services...');
    initializeServices().catch(err => {
      console.error('⚠️ Background service initialization failed:', err.message);
    });
  }, 10000); // 10 seconds delay

  console.log('---------------------');
  console.log(`📡 WebSocket server is enabled`);
} catch(error) {
  console.error('❌ Server startup error:', error);
  console.error('⚠️ The server is running but some services failed to start. Check your database connection.');
  // Do NOT exit process.exit(1) so that /health remains accessible for debugging
}
);

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
