import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

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

export default function OrderHistory() {
  const [orders, setOrders] = useState<Order[]>([]);
  const navigate = useNavigate();

  const fallbackImage =
    "https://via.placeholder.com/80x80.png?text=Product+Image";

  // Load orders from localStorage when component mounts
  useEffect(() => {
    const savedOrders = localStorage.getItem("orders");
    if (savedOrders) {
      setOrders(JSON.parse(savedOrders));
    }
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="max-w-5xl mx-auto px-6 py-12 relative">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">📦 Order History</h1>
        <button
          onClick={() => navigate("/track-order")}
          className="px-5 py-2 bg-[#009632] text-white font-medium rounded-lg shadow hover:bg-[#007a29] transition"
        >
          🔍 Track Order
        </button>
      </div>

      {orders.length === 0 ? (
        <div className="text-center text-gray-600">
          No previous orders found on this device.
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2">
          {orders.map((order) => {
            const firstItem = order.items[0];
            return (
              <div
                key={order._id}
                className="bg-white shadow-md hover:shadow-lg transition rounded-xl p-6 border border-gray-100"
              >
                {/* Header */}
                <div className="flex justify-between items-center mb-4">
                  <p className="font-semibold text-gray-800 text-lg">
                    Order #{order._id.slice(-6)}
                  </p>
                  <span className="text-sm text-gray-500">
                    {formatDate(order.createdAt)}
                  </span>
                </div>

                {/* Thumbnail */}
                <div className="flex items-center gap-4 mb-5">
                  <img
                    src={firstItem?.image || fallbackImage}
                    alt={firstItem?.name || "Product image"}
                    className="w-20 h-20 rounded-lg object-cover border border-gray-200"
                  />
                  <div>
                    <p className="font-semibold text-gray-800">
                      {firstItem?.name || "Product"}
                    </p>
                    <p className="text-sm text-gray-600">
                      {order.items.length > 1
                        ? `+${order.items.length - 1} more item(s)`
                        : "1 item"}
                    </p>
                    <p className="mt-1 text-sm text-gray-500">
                      Status:{" "}
                      <span
                        className={`font-medium ${
                          order.status === "delivered"
                            ? "text-green-600"
                            : order.status === "failed"
                            ? "text-red-500"
                            : "text-yellow-600"
                        }`}
                      >
                        {order.status.charAt(0).toUpperCase() +
                          order.status.slice(1)}
                      </span>
                    </p>
                  </div>
                </div>

                {/* Items */}
                <ul className="space-y-2 text-gray-700">
                  {order.items.map((item, idx) => (
                    <li
                      key={idx}
                      className="flex justify-between text-sm border-b border-gray-100 py-1"
                    >
                      <span>
                        {item.name} × {item.qty}
                      </span>
                      <span className="font-medium">
                        ₦{(item.price * item.qty).toFixed(2)}
                      </span>
                    </li>
                  ))}
                </ul>

                {/* View Details button */}
                <button
                  onClick={() => navigate(`/orders/${order._id}`)}
                  className="mt-3 text-sm text-[#009632] font-medium hover:underline"
                >
                  View Details →
                </button>

                {/* Footer */}
                <div className="mt-5 flex justify-between items-center">
                  <span className="font-semibold text-gray-800">
                    Total: ₦{order.total.toFixed(2)}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
