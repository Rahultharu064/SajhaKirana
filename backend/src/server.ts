import app from "./app";
import { prismaClient } from "./config/client";
import http from "http"


const server = http.createServer(app);


const PORT = process.env.PORT || 5000;


server.listen(PORT, async () => {
    await prismaClient.$connect()
    console.log(`Server is running on port ${PORT}`)

})


