// server/controllers/paystackController.ts
import axios from "axios";
import { Request, Response } from "express";
import Order from "../models/Order";

export const initializePayment = async (req: Request, res: Response) => {
  const { amount, email, name, phone, orderId } = req.body;

  if (!amount || !email || !name || !phone || !orderId) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    const body = {
      email,
      amount: amount * 100, // convert Naira to kobo
      reference: `ORD-${orderId}-${Date.now()}`,
      callback_url: `https://ecommerce-platform-eight.vercel.app/orders/${orderId}/status`,
      metadata: {
        name,
        phone,
      },
    };

    const response = await axios.post(
      "https://api.paystack.co/transaction/initialize",
      body,
      {
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.data.status) {
      return res.status(400).json({ error: "Failed to initialize transaction" });
    }

    return res.json({
      authorization_url: response.data.data.authorization_url,
      reference: response.data.data.reference,
    });
  } catch (err) {
    console.error("❌ Paystack init error:", err);
    return res.status(500).json({ error: "Payment initialization failed" });
  }
};


export const verifyPayment = async (req: Request, res: Response) => {
  const { reference } = req.params;

  if (!reference) {
    return res.status(400).json({ error: "Reference is required" });
  }

  try {
    // Verify transaction with Paystack
    const response = await axios.get(
      `https://api.paystack.co/transaction/verify/${reference}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
        },
      }
    );

    const data = response.data;

    if (!data.status || data.data.status !== "success") {
      return res.status(400).json({ error: "Payment not successful" });
    }

    // Extract order ID from reference (assuming format is orderId-{timestamp})
    // If you used order._id directly as reference, you can just use it directly
    const orderId = reference; // or data.data.reference if it matches frontend

    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    // Update order status if not already successful
    if (order.status !== "successful") {
      order.status = "successful";
      await order.save();
    }

    return res.json({
      message: "Payment verified successfully",
      orderId: order._id,
      amount: data.data.amount / 100, // back to Naira
      reference: data.data.reference,
    });
  } catch (err) {
    console.error("❌ Paystack verify error:", err);
    return res.status(500).json({ error: "Verification failed" });
  }
};
