import express from "express";

const app = express();
const PORT = 5000;

// Middleware so Express can read JSON in requests
app.use(express.json());

// Example: get all orders (later we’ll connect this to storage/db)
app.get("/orders", (req, res) => {
  res.json([{ id: "12345", status: "processing" }]);
});

// Example: update an order status
app.put("/orders/:id", (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  res.json({ message: `Order ${id} updated to ${status}` });
});

// Start the server
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
