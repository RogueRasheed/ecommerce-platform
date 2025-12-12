import crypto from "crypto";
import { Request, Response } from "express";
import Order from "../models/Order";


export const handlePaystackWebhook = async (req: Request, res: Response) => {

console.log("🔥 Webhook hit!", req.headers);

try {
    const secret = process.env.PAYSTACK_SECRET_KEY;
    const rawBody = req.body.toString();
    // 1. Verify signature using RAW body
    const hash = crypto
      .createHmac("sha512", secret as string)
      .update(rawBody)
      .digest("hex");

    if (hash !== req.headers["x-paystack-signature"]) {
      console.log("❌ Invalid webhook signature");
      return res.status(401).send("Invalid signature");
    }

    // 2. Parse JSON normally
    const event = JSON.parse(rawBody);

    console.log("🔥 Paystack Webhook Event:", event.event);

    if (event.event === "charge.success") {
      const reference = event.data.reference;

      console.log("📦 Payment successful via webhook for:", reference);

      await Order.findOneAndUpdate(
        { paymentReference: reference },
        {
          paymentStatus: "successful",
          transactionId: event.data.id,
          paidAt: new Date(),
          paymentData: event.data,
        }
      );

      return res.status(200).send("Webhook processed");
    }

    // Ignore other event types
    return res.status(200).send("Event ignored");
  } catch (err) {
    console.error("❌ Webhook error:", err);
    return res.status(500).send("Server error");
  }
};
