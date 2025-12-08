import Order from "../models/Order";
import { Request, Response } from "express";

// Valid status values
const validStatuses = ["pending", "shipped", "delivered", "cancelled"];

// 📦 Get a single order by ID
export const getOrderById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const order = await Order.findById(id).populate("items.productId");
    if (!order) return res.status(404).json({ message: "Order not found" });

    res.json({ order });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch order", error: (error as Error).message });
  }
};

// 🧾 Get all orders (with optional status filter and search)
export const getAllOrders = async (req: Request, res: Response) => {
  try {
    const { status, search } = req.query;

    let filter: any = {};

    // Status filter
    if (status && typeof status === "string") {
      if (!validStatuses.includes(status)) {
        return res.status(400).json({ 
          message: `Invalid status filter. Allowed values: ${validStatuses.join(", ")}` 
        });
      }
      filter.status = status;
    }

    // Search by name, email, phone, or address
    if (search && typeof search === "string") {
      filter.$or = [
        { customerName: { $regex: search, $options: "i" } },
        { customerEmail: { $regex: search, $options: "i" } },
        { customerPhone: { $regex: search, $options: "i" } },
        { customerAddress: { $regex: search, $options: "i" } },
      ];
    }

    const orders = await Order.find(filter).populate("items.productId");
    res.json({ orders });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch orders", error: (error as Error).message });
  }
};

// 🔁 Update order status
export const updateOrderStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!validStatuses.includes(status)) {
      return res.status(400).json({ 
        message: `Invalid status. Allowed values: ${validStatuses.join(", ")}` 
      });
    }

    const order = await Order.findById(id);
    if (!order) return res.status(404).json({ message: "Order not found" });

    order.paymentStatus = status;
    await order.save();

    res.json({ message: "Order status updated successfully", order });
  } catch (error) {
    res.status(500).json({ message: "Failed to update order", error: (error as Error).message });
  }
};

// ❌ Cancel an order
export const cancelOrder = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const order = await Order.findById(id);
    if (!order) return res.status(404).json({ message: "Order not found" });

    order.paymentStatus = "cancelled";
    await order.save();

    res.json({ message: "Order cancelled successfully", order });
  } catch (error) {
    res.status(500).json({ message: "Failed to cancel order", error: (error as Error).message });
  }
};

// ✅ Mark an order as delivered
export const markOrderDelivered = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const order = await Order.findById(id);
    if (!order) return res.status(404).json({ message: "Order not found" });

    order.paymentStatus = "delivered";
    await order.save();

    res.json({ message: "Order marked as delivered", order });
  } catch (error) {
    res.status(500).json({ message: "Failed to update order", error: (error as Error).message });
  }
};

// 🚚 Ship an order (pending → shipped)
export const shipOrder = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const order = await Order.findById(id);
    if (!order) return res.status(404).json({ message: "Order not found" });

    if (order.paymentStatus !== "pending") {
      return res.status(400).json({ message: "Only pending orders can be shipped" });
    }

    order.paymentStatus = "shipped";
    await order.save();

    res.json({ message: "Order marked as shipped", order });
  } catch (error) {
    res.status(500).json({ message: "Failed to ship order", error: (error as Error).message });
  }
};

// 📊 Get admin dashboard stats
export const getDashboardStats = async (req: Request, res: Response) => {
  try {
    const totalOrders = await Order.countDocuments();
    const pending = await Order.countDocuments({ status: "pending" });
    const shipped = await Order.countDocuments({ status: "shipped" });
    const delivered = await Order.countDocuments({ status: "delivered" });
    const cancelled = await Order.countDocuments({ status: "cancelled" });

    const orders = await Order.find();
    const totalRevenue = orders.reduce((acc, order) => acc + (order.total || 0), 0);

    res.json({
      totalOrders,
      pending,
      shipped,
      delivered,
      cancelled,
      totalRevenue,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch dashboard stats", error: (error as Error).message });
  }
};
