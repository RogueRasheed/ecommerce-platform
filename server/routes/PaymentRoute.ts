// server/routes/paystack.ts
import express, { Request, Response } from "express";
import { verifyPayment } from "../controllers/paymentController";

const router = express.Router();

router.get("/verify/:reference", verifyPayment);


// POST /api/paystack/init
router.post("/init", async (req: Request, res: Response) => {
  try {
    const { amount, email, name, phone, orderId } = req.body;

    if (!amount || !email || !name || !phone || !orderId) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Paystack expects amount in kobo
    const body = {
      email,
      reference: orderId,
      amount: amount * 100, // convert naira to kobo
      callback_url: `https://ecommerce-platform-eight.vercel.app/orders/${orderId}/status`,
      metadata: { name, phone },
    };

    const response = await fetch("https://api.paystack.co/transaction/initialize", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`, // your test key
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();

    if (!data.status) {
  console.error("❌ Paystack init failed:", data);
  return res.status(400).json({ error: "Failed to initialize transaction" });
}


    res.json({
      authorization_url: data.data.authorization_url,
      reference: data.data.reference,
    });
  } catch (err) {
    console.error("❌ Paystack initialization error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
