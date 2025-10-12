import { Request, Response } from "express";
import Order from "../models/Order";

// ✅ Create a new order
export const createOrder = async (req: Request, res: Response) => {
  try {
    const newOrder = new Order(req.body);
    const savedOrder = await newOrder.save();
    res.status(201).json(savedOrder);
  } catch (error: any) {
    res.status(500).json({ message: "Error creating order", error: error.message });
  }
};

// ✅ Get all orders (for admin dashboard)
export const getAllOrders = async (req: Request, res: Response) => {
  try {
    const orders = await Order.find().populate("products.productId", "name price");
    res.status(200).json(orders);
  } catch (error: any) {
    res.status(500).json({ message: "Error fetching orders", error: error.message });
  }
};

// ✅ Update order status
export const updateOrderStatus = async (req: Request, res: Response) => {
  try {
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    );
    res.status(200).json(order);
  } catch (error: any) {
    res.status(500).json({ message: "Error updating order", error: error.message });
  }
};
