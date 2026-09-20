import { Router, Request, Response } from "express";
import Order from "../models/Order";
import { sanity } from "../sanityClient";

const router = Router();

// ✅ Create order with product + stock validation (now against Sanity)
router.post("/", async (req: Request, res: Response) => {
  try {
    const { customerName, customerEmail, customerPhone, customerAddress, items } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ error: "Order must have at least one item" });
    }

    let total = 0;
    const orderItems = [];

    for (const item of items) {
      // Never trust price/name from the client — re-fetch from Sanity.
      const product = await sanity.fetch(
        `*[_type == "product" && _id == $id][0]{_id, name, price, stock}`,
        { id: item.productId }
      );

      if (!product) {
        return res.status(404).json({ error: `Product not found: ${item.productId}` });
      }

      if (product.stock < item.qty) {
        return res.status(400).json({ error: `Not enough stock for ${product.name}` });
      }

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

      // 🔐 REQUIRED DEFAULTS
      paymentStatus: "pending",
      orderStatus: "processing",
    });

    await order.save();

    // Decrement stock in Sanity for each item now that the order is saved.
    // (Runs after save so a DB failure doesn't leave stock wrongly reduced.)
    await Promise.all(
      orderItems.map((item) =>
        sanity
          .patch(item.productId)
          .dec({ stock: item.qty })
          .commit()
          .catch((err: unknown) =>
            console.error(`⚠️ Failed to decrement stock for ${item.productId}:`, err)
          )
      )
    );

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
  const orders = await Order.find();
  res.json(orders);
});

// ✅ Get order by ID
router.get("/:id", async (req: Request, res: Response) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ error: "Order not found" });
    res.json(order);
  } catch {
    res.status(400).json({ error: "Invalid ID format" });
  }
});

// ✅ Get all orders by customer email or phone (for order history page)
router.get("/lookup/customer", async (req: Request, res: Response) => {
  try {
    const { email, phone } = req.query;

    if (!email && !phone) {
      return res.status(400).json({ error: "Email or phone number required" });
    }

    const query: any = { $or: [] };
    if (email) query.$or.push({ customerEmail: email });
    if (phone) query.$or.push({ customerPhone: phone });

    const orders = await Order.find(query).sort({ createdAt: -1 });

    if (orders.length === 0) {
      return res.status(404).json({ message: "No orders found for this customer" });
    }

    res.json(orders);
  } catch (err) {
    console.error("❌ Error fetching customer orders:", err);
    res.status(500).json({ error: "Failed to fetch order history" });
  }
});

router.patch("/:id/hide", async (req: Request, res: Response) => {
  try {
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { visibleToUser: false },
      { new: true }
    );

    if (!order) return res.status(404).json({ error: "Order not found" });

    res.json({ message: "Order hidden from user view", order });
  } catch (err) {
    console.error("❌ Failed to hide order:", err);
    res.status(400).json({ error: "Failed to hide order" });
  }
});

export default router;