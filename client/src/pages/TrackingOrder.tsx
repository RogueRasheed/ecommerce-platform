import { useState } from "react";
import { findOrder, addOrder } from "../utils/orderStorage";
import type { Order } from "../utils/orderStorage";

export default function TrackingOrder() {
  const [orderId, setOrderId] = useState("");
  const [order, setOrder] = useState<Order | null>(null);

  const handleSearch = () => {
    const found = findOrder(orderId);
    setOrder(found);
  };

  // Example: Add dummy order if not exists (for testing)
  const handleCreate = () => {
    const newOrder: Order = {
      id: Math.floor(Math.random() * 100000).toString(),
      status: "processing",
    };
    addOrder(newOrder);
    alert(`Order #${newOrder.id} created!`);
  };

  return (
    <div className="max-w-lg mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6 text-center">Track Your Order</h1>

      <div className="flex gap-2 mb-6">
        <input
          type="text"
          value={orderId}
          onChange={(e) => setOrderId(e.target.value)}
          placeholder="Enter Order ID"
          className="flex-1 px-4 py-2 border rounded-lg"
        />
        <button
          onClick={handleSearch}
          className="px-4 py-2 bg-[#009632] text-white rounded-lg hover:bg-[#009632] transition"
        >
          Search
        </button>
      </div>

      {order ? (
        <div className="p-4 bg-gray-100 rounded-lg text-center">
          <p className="text-lg font-semibold">Order ID: {order.id}</p>
          <p className="text-[#009632] font-bold text-xl mt-2">
            Status: {order.status}
          </p>
        </div>
      ) : (
        orderId && (
          <p className="text-red-500 text-center">❌ Order not found</p>
        )
      )}

      <div className="mt-6 text-center">
        <button
          onClick={handleCreate}
          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
        >
          Create Dummy Order
        </button>
      </div>
    </div>
  );
}
// ✅ New page for tracking orders by ID