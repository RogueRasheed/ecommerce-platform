import { Link, useNavigate, useParams } from "react-router-dom";
import Stepper from "../components/Stepper";
import { useEffect, useState } from "react";

type Order = {
  _id: string;
  customerName: string;
  customerEmail: string;
  items: { productId: string; qty: number }[];
  status: "processing" | "shipped" | "delivered" | "failed";
};

const statusConfig = {
  processing: { color: "text-yellow-600", message: "Your order is being processed.", emoji: "⏳" },
  shipped: { color: "text-blue-600", message: "Your order has been shipped.", emoji: "🚚" },
  delivered: { color: "text-green-600", message: "Your order has been delivered successfully!", emoji: "✅" },
  failed: { color: "text-red-600", message: "Unfortunately, your order failed.", emoji: "❌" },
};

const steps = ["Processing", "Shipped", "Delivered"];

export default function OrderStatus() {
  const { id } = useParams<{ id: string }>();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // ✅ Fetch order from backend
  useEffect(() => {
    if (id) {
      fetch(`https://ecommerce-platform-jkg6.onrender.com/api/orders/${id}`)
        .then((res) => {
          if (!res.ok) throw new Error("Order not found");
          return res.json();
        })
        .then((data) => setOrder(data))
        .catch(() => setOrder(null))
        .finally(() => setLoading(false));
    }
  }, [id]);

  // ✅ Update order status in backend
  const handleStatusChange = async (newStatus: Order["status"]) => {
    if (!order) return;

    try {
      const res = await fetch(
        `https://ecommerce-platform-jkg6.onrender.com/api/orders/${order._id}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: newStatus }),
        }
      );

      if (!res.ok) throw new Error("Failed to update order");

      const updatedOrder = await res.json();
      setOrder(updatedOrder);

      // optional: refresh URL
      navigate(`/order/${order._id}/status`);
    } catch (err) {
      console.error(err);
      alert("❌ Failed to update order status");
    }
  };

  if (loading) {
    return <div className="text-center py-16">⏳ Loading order...</div>;
  }

  if (!order) {
    return (
      <div className="text-center py-16 text-red-600">
        ⚠️ Order not found
      </div>
    );
  }

  const config = statusConfig[order.status];
  const currentStep = steps.findIndex((s) => s.toLowerCase() === order.status.toLowerCase());

  return (
    <div className="max-w-2xl mx-auto text-center py-16 px-6">
      <h1 className="text-3xl font-bold mb-4">Order #{order._id}</h1>

      <div className={`text-5xl mb-4 ${config.color}`}>{config.emoji}</div>
      <p className={`text-xl font-semibold ${config.color}`}>{config.message}</p>

      {order.status !== "failed" ? (
        <div className="mt-10">
          <Stepper steps={steps} currentStep={currentStep} />
        </div>
      ) : (
        <div className="mt-10 text-red-600 font-semibold text-lg">
          ❌ Order Failed
        </div>
      )}

      {/* Admin buttons (optional, keep or remove depending on your use case) */}
      <div className="mt-6 flex justify-center gap-4">
        <button
          onClick={() => handleStatusChange("processing")}
          className="px-4 py-2 bg-yellow-500 text-white rounded"
        >
          Set Processing
        </button>
        <button
          onClick={() => handleStatusChange("shipped")}
          className="px-4 py-2 bg-blue-500 text-white rounded"
        >
          Set Shipped
        </button>
        <button
          onClick={() => handleStatusChange("delivered")}
          className="px-4 py-2 bg-green-600 text-white rounded"
        >
          Set Delivered
        </button>
        <button
          onClick={() => handleStatusChange("failed")}
          className="px-4 py-2 bg-red-600 text-white rounded"
        >
          Set Failed
        </button>
      </div>

      <div className="mt-12">
        <Link
          to="/order-history"
          className="px-6 py-2 bg-indigo-600 text-white rounded-lg shadow hover:bg-indigo-700"
        >
          Back to Orders
        </Link>
      </div>
    </div>
  );
}
