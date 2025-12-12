
import express, { Request, Response } from "express";
import { verifyPayment, initializePayment } from "../controllers/paymentController";
import { handlePaystackWebhook } from "../controllers/webhookController";

const router = express.Router();

// Important: RAW body must be used ONLY for the webhook route
router.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  handlePaystackWebhook
);


router.get("/verify/:reference", verifyPayment);


// POST /api/paystack/init
router.post("/init", initializePayment);

export default router;
