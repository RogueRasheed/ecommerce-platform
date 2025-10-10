import express from "express";
import { updateOrderStatus, getAllOrders, markOrderDelivered, cancelOrder, shipOrder, getDashboardStats, getOrderById } from "../controllers/adminController";
import  verifyAdmin  from "../middleware/verifyAdmin";

const router = express.Router();

// GET all orders (admin only)
router.get("/orders", verifyAdmin, getAllOrders);

// UPDATE order status by ID (admin only)
router.put("/orders/:id/status", verifyAdmin, updateOrderStatus);

router.get("/orders/:id", verifyAdmin, getOrderById);
router.put("/orders/:id/ship", verifyAdmin, shipOrder);
router.put("/orders/:id/cancel", verifyAdmin, cancelOrder);
router.put("/orders/:id/deliver", verifyAdmin, markOrderDelivered);
router.get("/dashboard/stats", verifyAdmin, getDashboardStats);


// Admin dashboard test route
router.get("/dashboard", verifyAdmin, (req, res) => {
  res.json({ message: "Welcome to the admin dashboard!" });
});

export default router;
