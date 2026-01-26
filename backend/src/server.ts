import app from "./app";
import { prismaClient } from "./config/client";
import http from "http"
import { initSocket } from "./utils/socket";
import { initializeQdrantCollection } from "../src/config/qdrant";


const server = http.createServer(app);
// Initialize Socket.IO
initSocket(server);

const PORT = process.env.PORT || 5003;
async function initializeServices() {
  try {
    await initializeQdrantCollection();
    console.log('✅ Qdrant initialized');
  } catch (error) {
    console.error('❌ Failed to initialize services:', error);
  }
}



server.listen(PORT, async () => {
    try {
        await prismaClient.$connect()
        console.log(`✅ Database connected successfully`)
        console.log(`🚀 Server is running on port ${PORT}`)
    } catch (error) {
        console.error('❌ Database connection failed:', error)
        console.log(`⚠️  Server is running on port ${PORT} but database is not connected`)
    }
})

