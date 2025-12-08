
import axios from "axios";
import { Request, Response } from "express";
import Order from "../models/Order"; 

// Your Secret Key is safely accessed here
const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY;

// -----------------------------------------------------------
export const initializePayment = async (req: Request, res: Response) => {
  const { amount, email, name, phone, orderId } = req.body;

  if (!amount || !email || !name || !phone || !orderId) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    const body = {
      email,
      amount: amount * 100, // convert Naira to kobo
      // Creates the unique reference that includes the MongoDB Order ID
      reference: `ORD-${orderId}-${Date.now()}`,
      callback_url: `https://ecommerce-platform-eight.vercel.app/orders/${orderId}/status`,
      metadata: { name, phone },
    };

    const response = await axios.post(
      "https://api.paystack.co/transaction/initialize",
      body,
      {
        headers: {
          Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.data.status) {
      console.error("❌ Paystack init failed:", response.data);
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

// -----------------------------------------------------------
// verifyPayment (CORRECTED property name)
// -----------------------------------------------------------

export const verifyPayment = async (req: Request, res: Response) => {
  const { reference } = req.params;

  if (!reference) {
    return res.status(400).json({ error: "Reference is required" });
  }

  try {
    // 1. Verify transaction with Paystack using the Secret Key
    const response = await axios.get(
      `https://api.paystack.co/transaction/verify/${reference}`,
      {
        headers: {
          Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
        },
      }
    );

    const paystackData = response.data.data;

    if (!response.data.status || paystackData.status !== "success") {
      console.warn("⚠️ Paystack status check failed:", paystackData);
      return res.status(400).json({ error: "Payment not successful or verification failed" });
    }

    // 2. Extract the MongoDB Order ID from the unique reference
    const parts = reference.split('-'); 
    const orderId = parts.length > 1 ? parts[1] : reference;

    // Use Order.findById which now includes type safety thanks to IOrder
    const order = await Order.findById(orderId);

    if (!order) {
      console.error(`Order not found for ID: ${orderId}`);
      return res.status(404).json({ error: "Order not found in database" });
    }

    // 3. 🚨 CRITICAL SECURITY CHECK: Compare Amount
    const paidAmountKobo = paystackData.amount; // Amount from Paystack (in kobo)
    
    // 🔥🔥 FIXED: Using order.total to match your Mongoose Schema 🔥🔥
    const expectedAmountKobo = order.total * 100; 

    if (paidAmountKobo !== expectedAmountKobo) {
        console.error(`Amount mismatch! Order ID: ${orderId}. Paid: ${paidAmountKobo}, Expected: ${expectedAmountKobo}`);
        return res.status(400).json({ 
            error: "Amount paid does not match the expected order amount. Security flag raised."
        });
    }

    // 4. Fulfill the Order (Only if not already successful)
    if (order.paymentStatus !== "successful") {
      order.paymentStatus = "successful";
      order.paymentReference = reference; 
      await order.save();
    }

    return res.json({
      message: "Payment verified successfully",
      orderId: order._id,
      amount: paystackData.amount / 100, // back to Naira for display
      reference: paystackData.reference,
    });
  
  } catch (err) {
    // Check if the error object has a 'message' property
    const message = (err as { message?: string })?.message || "Unknown error";

    console.error("❌ Paystack verify error:", message);
    return res.status(500).json({ error: "Verification failed due to a server or network error" });
  }
};