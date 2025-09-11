import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import Order from './models/Order';
dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

  // Connect to MongoDB
  mongoose.connect(process.env.MONGO_URI as string)
  .then(() => console.log('✅ MongoDB connected'))
  .catch(err => console.error('❌ MongoDB error:', err));

// Routes
app.post('/api/orders', async (req: Request, res: Response) => {
  try {
    const order = new Order(req.body);
    await order.save();
    res.status(201).json(order);
  } catch {
    res.status(400).json({ error: 'Failed to create order' });
  }
});

app.get('/api/orders', async (_req: Request, res: Response) => {
  const orders = await Order.find();
  res.json(orders);
});

app.get('/api/orders/:id', async (req: Request, res: Response) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ error: 'Order not found' });
    res.json(order);
  } catch {
    res.status(400).json({ error: 'Invalid ID format' });
  }
});

app.patch('/api/orders/:id/status', async (req: Request, res: Response) => {
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

app.listen(port, () => {
  console.log(`API running at http://localhost:${port}`);
});
