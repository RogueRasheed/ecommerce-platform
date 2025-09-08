import { Router, Request, Response } from 'express';
import Order from '../models/Order';

const router = Router();

// Create order
router.post('/', async (req: Request, res: Response) => {
  try {
    const order = new Order(req.body);
    await order.save();
    res.status(201).json(order);
  } catch {
    res.status(400).json({ error: 'Failed to create order' });
  }
});

// Get all orders
router.get('/', async (_req: Request, res: Response) => {
  const orders = await Order.find();
  res.json(orders);
});

// Get order by ID
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ error: 'Order not found' });
    res.json(order);
  } catch {
    res.status(400).json({ error: 'Invalid ID format' });
  }
});

// Update order status
router.patch('/:id/status', async (req: Request, res: Response) => {
  const { status } = req.body;
  try {
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    if (!order) return res.status(404).json({ error: 'Order not found' });
    res.json(order);
  } catch {
    res.status(400).json({ error: 'Failed to update status' });
  }
});

export default router;
