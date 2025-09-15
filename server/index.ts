import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import mongoose from "mongoose";
import orderRoutes from "./routes/orders";
import productRoutes from "./routes/products";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// ✅ Allowed origins (local + vercel)
const allowedOrigins = [
  "http://localhost:5173", // vite dev
  "http://localhost:3000", // sometimes used in dev
  "https://ecommerce-platform-eight.vercel.app" // your vercel frontend
];

// ✅ Dynamic CORS setup
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

app.use(express.json());

// ✅ MongoDB connection
mongoose
  .connect(process.env.MONGO_URI as string)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB error:", err));

// ✅ API routes
app.use("/api/orders", orderRoutes);
app.use("/api/products", productRoutes);

app.listen(port, () => {
  console.log(`API running at http://localhost:${port}`);
});


