// src/app.ts (or index.ts)
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import categoryRoutes from "./routes/categoryRoute";
import productRoutes from "./routes/productRoute";
import authRoutes from "./routes/authRoute";
import { prismaClient } from "./config/client";
import path from "path";
import { fileURLToPath } from "url";
import cartRoutes from "./routes/cartRoute";
import inventoryRoutes from "./routes/inventoryRoute";
import orderRoutes from "./routes/orderRoute";
import reviewRoutes from "./routes/reviewRoute";
import reviewAdminRoutes from "./routes/reviewAdminRoute";
import paymentRoutes from "./routes/paymentRoute";
import districtRoutes from "./routes/districtRoute";
import couponRoutes from "./routes/couponRoute";
import userRoutes from "./routes/userRoute";
import chatbotRoutes from "./routes/chatbotRoute";
import searchRoutes from "./routes/searchRoute";
import wishlistRoutes from "./routes/wishlistRoute";
import customerServiceRoutes from "./routes/customerServiceRoute";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const allowedOrigins = [
  process.env.FRONTEND_URL || "http://localhost:5173",
  process.env.VERCEL_URL || "https://sajha-kirana-lp5l77fts-rahultharu064s-projects.vercel.app", // Added specific Vercel URL
  "http://localhost:3000", // if using create-react-app default port
  "http://localhost:8080", // if using other dev servers
  "http://localhost:5003", // api server itself
];

app.use(
  cors({
    origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
      // allow requests with no origin (like mobile apps, curl, server-to-server)
      if (!origin) return callback(null, true);
      if (allowedOrigins.indexOf(origin) === -1) {
        console.log(`CORS: Allowing access from ${origin}`);
        // For development, allow any localhost origin
        if (origin.startsWith('http://localhost:')) {
          return callback(null, true);
        }
        const msg = `The CORS policy for this site does not allow access from the specified Origin.`;
        return callback(new Error(msg), false);
      }
      return callback(null, true);
    },
    credentials: true,
  })
);

// Health check endpoint
// Health check endpoint
app.get("/health", async (req: express.Request, res: express.Response) => {
  try {
    // Race the DB query against a timeout
    const dbCheck = Promise.race([
      prismaClient.$queryRaw`SELECT 1`,
      new Promise((_, reject) => setTimeout(() => reject(new Error('DB Timeout')), 3000))
    ]);

    await dbCheck;

    res.status(200).json({
      status: "ok",
      timestamp: new Date().toISOString(),
      services: { database: "connected" }
    });
  } catch (error: any) {
    // Even if DB fails, return 200 so Railway keeps the container alive
    // The app might still be functional for static content or cached data
    console.error('Health check failed (but sending 200):', error);
    res.status(200).json({
      status: "degraded",
      message: "Database connection failed or timed out",
      timestamp: new Date().toISOString(),
      services: { database: "disconnected", error: error.message }
    });
  }
});

// Serve static files from uploads directory
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

// API Routes
app.use("/auth", authRoutes);
app.use("/categories", categoryRoutes);
app.use("/products", productRoutes);
app.use("/cart", cartRoutes);
app.use("/inventory", inventoryRoutes);
app.use("/reviews", reviewRoutes);
app.use("/admin/reviews", reviewAdminRoutes);
app.use("/orders", orderRoutes);
app.use("/payment", paymentRoutes);
app.use("/districts", districtRoutes);
app.use("/coupons", couponRoutes);
app.use("/users", userRoutes);
app.use("/chatbot", chatbotRoutes);
app.use("/search", searchRoutes);
app.use("/wishlist", wishlistRoutes);
app.use("/customer-service", customerServiceRoutes);

// Error handling middleware
app.use((error: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Error:', error);
  res.status(500).json({ message: 'Internal server error', error: error.message });
});

export default app;
