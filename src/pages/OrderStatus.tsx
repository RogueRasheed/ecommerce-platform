import { useNavigate, useParams } from "react-router-dom";
import Stepper from "../components/Stepper";
import { findOrder, updateOrder } from "../utils/orderStorage";
import type { Order } from "../utils/orderStorage";
import { useEffect, useState } from "react";

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
  const navigate = useNavigate();

  useEffect(() => {
    if (id) {
      setOrder(findOrder(id));
    }
  }, [id]);

   const handleStatusChange = (newStatus: Order["status"]) => {
    if (order) {
      updateOrder(order.id, newStatus);           // update localStorage
      setOrder({ ...order, status: newStatus });  // update UI
      navigate(`/order/${order.id}/status`);      // optional: refresh URL
    }
  };

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
      <h1 className="text-3xl font-bold mb-4">Order #{order.id}</h1>

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
        <a
          href="/order-history"
          className="px-6 py-2 bg-indigo-600 text-white rounded-lg shadow hover:bg-indigo-700"
        >
          Back to Orders
        </a>
      </div>
    </div>
  );
}
