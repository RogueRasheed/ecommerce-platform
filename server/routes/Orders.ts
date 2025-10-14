import { Router, Request, Response } from "express";
import Order from "../models/Order";
import { Product } from "../models/Products";

const router = Router();

// ✅ Create order with product + stock validation
router.post("/", async (req: Request, res: Response) => {
  try {
    const { customerName, customerEmail, customerPhone, customerAddress, items } = req.body;

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
      customerPhone,
      customerAddress,
      items: orderItems,
      total,
    });

    await order.save();
    res.status(201).json(order);
  } catch (err) {
    console.error("❌ Error creating order:", err);
    res.status(400).json({
      error: err instanceof Error ? err.message : "Failed to create order",
    });
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


// ✅ NEW: Get all orders by customer email or phone (for order history page)
router.get("/lookup/customer", async (req: Request, res: Response) => {
  try {
    const { email, phone } = req.query;

    if (!email && !phone) {
      return res.status(400).json({ error: "Email or phone number required" });
    }

    const query: any = {};
    if (email) query.customerEmail = email;
    if (phone) query.customerPhone = phone;

    const orders = await Order.find(query)
      .populate("items.productId", "name price")
      .sort({ createdAt: -1 });

    if (orders.length === 0) {
      return res.status(404).json({ message: "No orders found for this customer" });
    }

    res.json(orders);
  } catch (err) {
    console.error("❌ Error fetching customer orders:", err);
    res.status(500).json({ error: "Failed to fetch order history" });
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
