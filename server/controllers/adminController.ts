import Order from "../models/Order";
import { Request, Response } from "express";

const validOrderStatuses = ["processing", "shipped", "delivered", "cancelled"];

// 📦 Get single order
export const getOrderById = async (req: Request, res: Response) => {
  const order = await Order.findById(req.params.id).populate("items.productId");
  if (!order) return res.status(404).json({ message: "Order not found" });

  res.json({ order });
};

// 🧾 Get all orders
export const getAllOrders = async (req: Request, res: Response) => {
  const { orderStatus } = req.query;

  const filter: any = {};
  if (orderStatus && validOrderStatuses.includes(orderStatus as string)) {
    filter.orderStatus = orderStatus;
  }

  const orders = await Order.find(filter).populate("items.productId");
  res.json({ orders });
};

// 🔁 Update order status (GENERIC)
export const updateOrderStatus = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { orderStatus } = req.body;

  if (!validOrderStatuses.includes(orderStatus)) {
    return res.status(400).json({ message: "Invalid order status" });
  }

  const order = await Order.findById(id);
  if (!order) return res.status(404).json({ message: "Order not found" });

  // 🚫 Prevent shipping unpaid orders
  if (orderStatus === "shipped" && order.paymentStatus !== "successful") {
    return res.status(400).json({
      message: "Order must be paid before shipping",
    });
  }

  // 🚫 Prevent delivering unshipped orders
  if (orderStatus === "delivered" && order.orderStatus !== "shipped") {
    return res.status(400).json({
      message: "Order must be shipped before delivery",
    });
  }

  order.orderStatus = orderStatus;
  await order.save();

  res.json({ message: "Order status updated", order });
};

// ❌ Cancel order
export const cancelOrder = async (req: Request, res: Response) => {
  const order = await Order.findById(req.params.id);
  if (!order) return res.status(404).json({ message: "Order not found" });

  if (order.orderStatus === "delivered") {
    return res.status(400).json({
      message: "Delivered orders cannot be cancelled",
    });
  }

  order.orderStatus = "cancelled";
  await order.save();

  res.json({ message: "Order cancelled", order });
};

// 📊 Dashboard stats
export const getDashboardStats = async (req: Request, res: Response) => {
  const totalOrders = await Order.countDocuments();

  const processing = await Order.countDocuments({ orderStatus: "processing" });
  const shipped = await Order.countDocuments({ orderStatus: "shipped" });
  const delivered = await Order.countDocuments({ orderStatus: "delivered" });
  const cancelled = await Order.countDocuments({ orderStatus: "cancelled" });

  const paidOrders = await Order.find({ paymentStatus: "successful" });
  const totalRevenue = paidOrders.reduce((sum, o) => sum + o.total, 0);

  res.json({
    totalOrders,
    processing,
    shipped,
    delivered,
    cancelled,
    totalRevenue,
  });
};
