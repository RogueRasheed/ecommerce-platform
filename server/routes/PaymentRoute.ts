// server/routes/paystack.ts
import express, { Request, Response } from "express";
import { verifyPayment, initializePayment } from "../controllers/paymentController";

const router = express.Router();

router.get("/verify/:reference", verifyPayment);


// POST /api/paystack/init
router.post("/init", initializePayment);

export default router;
