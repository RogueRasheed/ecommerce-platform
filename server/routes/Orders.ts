import { Router, Request, Response } from "express";
import Order from "../models/Order";
import { Product } from "../models/Products";

const router = Router();

// ✅ Create order with product + stock validation
router.post("/", async (req: Request, res: Response) => {
  try {
    const { customerName, customerEmail, items } = req.body;

    // Validate items exist
    if (!items || items.length === 0) {
      return res.status(400).json({ error: "Order must have at least one item" });
    }

    let total = 0;
    const orderItems = [];

    for (const item of items) {
      const product = await Product.findById(item.productId);
      if (!product) {
        return res.status(404).json({ error: `Product not found: ${item.productId}` });
      }

      if (product.stock < item.qty) {
        return res.status(400).json({ error: `Not enough stock for ${product.name}` });
      }

      // Reduce stock
      product.stock -= item.qty;
      await product.save();

      total += product.price * item.qty;

      orderItems.push({
        productId: product._id,
        name: product.name,
        price: product.price,
        qty: item.qty,
      });
    }

    const order = new Order({
      customerName,
      customerEmail,
      items: orderItems,
      total,
    });

    await order.save();
    res.status(201).json(order);
  } 
    catch (err) {
    console.error("❌ Error creating order:", err);

    if (err instanceof Error) {
      res.status(400).json({ error: err.message });
    } else {
      res.status(400).json({ error: "Failed to create order" });
    }
  }


});

// ✅ Get all orders
router.get("/", async (_req: Request, res: Response) => {
  const orders = await Order.find().populate("items.productId", "name price");
  res.json(orders);
});

// ✅ Get order by ID
router.get("/:id", async (req: Request, res: Response) => {
  try {
    const order = await Order.findById(req.params.id).populate("items.productId", "name price");
    if (!order) return res.status(404).json({ error: "Order not found" });
    res.json(order);
  } catch {
    res.status(400).json({ error: "Invalid ID format" });
  }
});

// ✅ Update order status (restricted)
router.patch("/:id/status", async (req: Request, res: Response) => {
  const { status } = req.body;
  const allowedStatuses = ["processing", "successful", "failed", "delivered"];

  if (!allowedStatuses.includes(status)) {
    return res.status(400).json({ error: "Invalid status value" });
  }

  try {
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    if (!order) return res.status(404).json({ error: "Order not found" });
    res.json(order);
  } catch {
    res.status(400).json({ error: "Failed to update status" });
  }
});

export default router;
