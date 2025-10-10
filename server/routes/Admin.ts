import express from "express";
import { updateOrderStatus, getAllOrders } from "../controllers/adminController";
import verifyAdmin from "../middleware/verifyAdmin";
import { verifyToken } from "../middleware/authMiddleware";

const router = express.Router();

// GET all orders
router.get("/orders", verifyAdmin, getAllOrders);

// UPDATE order status by ID
router.put("/orders/:id/status", verifyAdmin, updateOrderStatus);

router.get('/dashboard', verifyAdmin, (req, res) => {
  res.json({ message: 'Welcome to the admin dashboard!' });
});

router.get('/dashboard', verifyToken, (req, res) => {
  res.json({ message: 'Welcome to the admin dashboard!' });
});

export default router;
