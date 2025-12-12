import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import mongoose from "mongoose";

import orderRoutes from "./routes/Orders";
import productRoutes from "./routes/Products";
import adminRoutes from "./routes/Admin";
import authRoutes from "./routes/AuthRoutes";
import messageRoutes from "./routes/messageRoutes";
import paymentRoutes from "./routes/PaymentRoute";

import { handlePaystackWebhook } from "./controllers/webhookController";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// CORS
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:3000",
  "https://ecommerce-platform-eight.vercel.app",
  "https://ecommerce-platform-jkg6.onrender.com",
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) callback(null, true);
      else callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  })
);

// 1️⃣ Global JSON parser (must be before all normal routes)
app.use(express.json());

// MongoDB connection
mongoose
  .connect(process.env.MONGO_URI as string)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB error:", err));

// 2️⃣ Normal API routes
app.use("/api/payments", paymentRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/products", productRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/message", messageRoutes);

// 3️⃣ Webhook (RAW body) — MUST be last
app.post(
  "/api/paystack/webhook",
  express.raw({ type: "application/json" }),
  handlePaystackWebhook
);

app.listen(port, () => {
  console.log(`API running at http://localhost:${port}`);
});
