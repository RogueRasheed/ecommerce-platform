import mongoose from "mongoose";
import dotenv from "dotenv";
import { Product } from "./models/Products";
import { seedProducts } from "./seedData/products"; // adjust path if needed

dotenv.config();

async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URI as string);
    console.log("✅ MongoDB connected");

    await Product.deleteMany(); // clear old data

    // Map local products to DB schema
    const formatted = seedProducts.map((p) => ({
      name: p.name,
      description: p.description,
      price: p.price,
      image: p.image,
      category: p.category,
      id: p.id,
      stock: 12, // default stock since your local data doesn’t have it
    }));

    await Product.insertMany(formatted);
    console.log("✅ Products seeded successfully!");

    process.exit(0);
  } catch (err) {
    console.error("❌ Error seeding products:", err);
    process.exit(1);
  }
}

seed();
