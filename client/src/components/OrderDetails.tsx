import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

type OrderItem = {
  productId: string;
  name: string;
  price: number;
  qty: number;
  image?: string;
};

type Order = {
  _id: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  items: OrderItem[];
  total: number;
  createdAt: string;
  status: "processing" | "successful" | "failed" | "delivered";
};

export default function OrderDetails() {
  const { id } = useParams<{ id: string }>();
  const [order, setOrder] = useState<Order | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await fetch(
          `https://ecommerce-platform-jkg6.onrender.com/api/orders/${id}`
        );
        if (!res.ok) throw new Error("Order not found");
        const data = await res.json();
        setOrder(data);
      } catch (err) {
        console.error("Error fetching order details:", err);
      }
    };

    fetchOrder();
  }, [id]);

  const fallbackImage =
    "https://via.placeholder.com/100x100.png?text=Product+Image";

  if (!order)
    return (
      <div className="max-w-3xl mx-auto py-20 text-center text-gray-600">
        Loading order details...
      </div>
    );

  return (
    <div className="max-w-3xl mx-auto px-6 py-12">
      <button
        onClick={() => navigate(-1)}
        className="mb-6 px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg"
      >
        ← Back
      </button>

      <div className="bg-white shadow-lg rounded-2xl p-8 border border-gray-100">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">
          Order #{order._id.slice(-6)}
        </h1>
        <p className="text-gray-500 mb-6">
          Placed on {new Date(order.createdAt).toLocaleDateString()}
        </p>

        <div className="border-t border-gray-100 pt-4">
          <p className="font-semibold mb-1">Status:</p>
          <span
            className={`inline-block px-3 py-1 rounded-full text-sm ${
              order.status === "delivered"
                ? "bg-green-100 text-green-700"
                : order.status === "failed"
                ? "bg-red-100 text-red-700"
                : "bg-yellow-100 text-yellow-700"
            }`}
          >
            {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
          </span>
        </div>

        <div className="mt-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-3">
            Order Summary
          </h2>
          <ul className="divide-y divide-gray-100">
            {order.items.map((item, idx) => (
              <li key={idx} className="flex items-center justify-between py-3">
                <div className="flex items-center gap-3">
                  <img
                    src={item.image || fallbackImage}
                    alt={item.name}
                    className="w-16 h-16 rounded-lg object-cover border"
                  />
                  <div>
                    <p className="font-medium text-gray-800">{item.name}</p>
                    <p className="text-sm text-gray-500">Qty: {item.qty}</p>
                  </div>
                </div>
                <p className="font-medium text-gray-800">
                  ${(item.price * item.qty).toFixed(2)}
                </p>
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-6 flex justify-between items-center">
          <p className="text-lg font-semibold text-gray-800">
            Total: ${order.total.toFixed(2)}
          </p>
        </div>

        <div className="mt-8 border-t border-gray-100 pt-4 text-center">
          <p className="text-gray-600">
            Thank you for shopping with us ❤️ <br />
            We appreciate your business!
          </p>
        </div>
      </div>
    </div>
  );
}
