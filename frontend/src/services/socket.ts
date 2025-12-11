import { io } from "socket.io-client";

const SOCKET_URL = "http://localhost:5003"; // Adjust to match your backend URL

export const socket = io(SOCKET_URL, {
    autoConnect: true,
});

socket.on("connect", () => {
    console.log("✅ Socket Connected:", socket.id);
});

socket.on("disconnect", () => {
    console.log("❌ Socket Disconnected");
});

socket.on("connect_error", (err) => {
    console.error("⚠️ Socket Connection Error:", err);
});
