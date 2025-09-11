import { Router, Request, Response } from "express";
import { Product } from "../models/Products";

const router = Router();

// ✅ Create new product
router.post("/", async (req: Request, res: Response) => {
  try {
    const { name, description, price, image, stock, category } = req.body;

    if (!name || !description || !price || !image) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const product = new Product({
      name,
      description,
      price,
      image,
      stock,
      category,
    });

    await product.save();
    res.status(201).json(product);
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: "Failed to create product" });
  }
});

// ✅ Get all products
router.get("/", async (_req: Request, res: Response) => {
  const products = await Product.find();
  res.json(products);
});

// ✅ Get single product
router.get("/:id", async (req: Request, res: Response) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ error: "Product not found" });
    res.json(product);
  } catch {
    res.status(400).json({ error: "Invalid ID format" });
  }
});

// ✅ Update product
router.put("/:id", async (req: Request, res: Response) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!product) return res.status(404).json({ error: "Product not found" });
    res.json(product);
  } catch {
    res.status(400).json({ error: "Failed to update product" });
  }
});

// ✅ Delete product
router.delete("/:id", async (req: Request, res: Response) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ error: "Product not found" });
    res.json({ message: "Product deleted successfully" });
  } catch {
    res.status(400).json({ error: "Failed to delete product" });
  }
});

export default router;
