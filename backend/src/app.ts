import express from "express";
import dotenv from "dotenv";
import categoryRoutes from "./routes/categoryRoute";
import productRoutes from "./routes/productRoute";
import path from "path";
import { fileURLToPath } from "url";
import cartRoutes from "./routes/cartRoute";
import inventoryRoutes from "./routes/inventoryRoute";
import orderRoutes from "./routes/orderRoute";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const app = express();

app.use(express.json());

// Serve static files from uploads directory
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

// API Routes
app.use("/api/categories", categoryRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/inventory", inventoryRoutes);
app.use("/api/orders", orderRoutes);

export default app;
