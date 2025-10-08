import express from "express";
import { updateOrderStatus, getAllOrders } from "../controllers/adminController";

const router = express.Router();

// GET all orders
router.get("/orders", getAllOrders);

// UPDATE order status by ID
router.put("/orders/:id/status", updateOrderStatus);

export default router;
