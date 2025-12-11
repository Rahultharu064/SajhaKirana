import app from "./app";
import { prismaClient } from "./config/client";
import http from "http"


const server = http.createServer(app);
// Forced restart for route update to apply /payment change


const PORT = process.env.PORT || 5003;


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

