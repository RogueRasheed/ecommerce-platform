import { useEffect, useState } from "react";
import { useCart } from "../store/useCart";
import { Link, useParams } from "react-router-dom";

interface CartItem {
  id: number | string;
  name: string;
  price: number;
  quantity: number;
}

interface Order {
  id: number;
  items: CartItem[];
  total: number;
  date: string;
  status: string;
}

export default function OrderSuccessful() {
  const { id } = useParams<{ id: string }>();
  const [order, setOrder] = useState<Order | null>(null);
  const clearCart = useCart((state) => state.clearCart);

  useEffect(() => {
    try {
      // ✅ Try to find order from history
      const allOrders: Order[] = JSON.parse(localStorage.getItem("orders") || "[]");
      const foundOrder = allOrders.find((o) => o.id === Number(id));

      if (foundOrder) {
        setOrder(foundOrder);
      } else {
        // fallback: check lastOrder
        const savedOrder = localStorage.getItem("lastOrder");
        if (savedOrder) setOrder(JSON.parse(savedOrder) as Order);
      }

      clearCart(); // ✅ clear cart after loading order
    } catch (error) {
      console.error("Failed to load order:", error);
    }
  }, [id, clearCart]);

  if (!order) {
    return (
      <div className="max-w-xl mx-auto px-6 py-16 text-center">
        <h1 className="text-2xl font-bold mb-4">⚠️ No Order Found</h1>
        <p className="text-gray-600">Something went wrong. Please try again.</p>
        <Link
          to="/products"
          className="mt-6 inline-block px-6 py-2 bg-indigo-600 text-white rounded-lg shadow hover:bg-indigo-700"
        >
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-6 py-16 text-center">
      <h1 className="text-3xl font-bold mb-4 text-green-600">
        ✅ Order Successful!
      </h1>
      <p className="text-gray-600 mb-6">
        Your order has been placed and is being processed.
      </p>

      <OrderDetails order={order} />

      <Link
        to="/products"
        className="mt-8 inline-block px-6 py-2 bg-indigo-600 text-white rounded-lg shadow hover:bg-indigo-700"
      >
        Continue Shopping
      </Link>
    </div>
  );
}

function OrderDetails({ order }: { order: Order }) {
  return (
    <div className="bg-white p-6 rounded-xl shadow text-left">
      <p>
        <span className="font-semibold">Order ID:</span> {order.id}
      </p>
      <p>
        <span className="font-semibold">Date:</span> {order.date}
      </p>
      <p className="mt-4 font-semibold">Items:</p>
      <ul className="list-disc list-inside text-gray-700">
        {order.items.map((item) => (
          <li key={item.id}>
            {item.name} × {item.quantity} — $
            {(item.price * item.quantity).toFixed(2)}
          </li>
        ))}
      </ul>
      <p className="mt-4 text-lg font-bold">Total: ${order.total.toFixed(2)}</p>
    </div>
  );
}
