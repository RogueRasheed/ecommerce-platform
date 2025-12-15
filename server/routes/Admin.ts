import express from "express";
import { updateOrderStatus, getAllOrders, cancelOrder,  getDashboardStats, getOrderById } from "../controllers/adminController";
import  verifyAdmin  from "../middleware/verifyAdmin";

const router = express.Router();

// GET all orders (admin only)
router.get("/orders", verifyAdmin, getAllOrders);

// UPDATE order status by ID (admin only)
router.put("/orders/:id/status", verifyAdmin, updateOrderStatus);

router.get("/orders/:id", verifyAdmin, getOrderById);
router.put("/orders/:id/cancel", verifyAdmin, cancelOrder);
router.get("/dashboard/stats", verifyAdmin, getDashboardStats);


// Admin dashboard test route
router.get("/dashboard", verifyAdmin, (req, res) => {
  res.json({ message: "Welcome to the admin dashboard!" });
});

export default router;
