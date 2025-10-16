import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

type OrderItem = {
  id: number;
  name: string;
  price: number;
  quantity: number;
  image?: string;
};

type Order = {
  id: number;
  items: OrderItem[];
  total: number;
  date: string;
  status: "Processing" | "Shipped" | "Delivered" | "Failed";
};

export default function OrderHistory() {
  const [orders, setOrders] = useState<Order[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const savedOrders = localStorage.getItem("orders");
    if (savedOrders) setOrders(JSON.parse(savedOrders));
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const fallbackImage =
    "https://via.placeholder.com/80x80.png?text=Product+Image";

  if (orders.length === 0) {
    return (
      <div className="max-w-xl mx-auto px-6 py-16 text-center">
        <h1 className="text-2xl font-bold mb-4">No Past Orders</h1>
        <p className="text-gray-600">
          You haven’t placed any orders yet. Start shopping and your orders will
          appear here!
        </p>
        <a
          href="/products"
          className="mt-6 inline-block px-6 py-2 bg-[#009632] text-white rounded-lg shadow hover:bg-[#007a29]"
        >
          Browse Products
        </a>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-6 py-12 relative">
      {/* Header with top-right button */}
      <div className="flex justify-between items-center mb-10">
        <h1 className="text-3xl font-bold text-gray-800">📦 Order History</h1>
        <button
          onClick={() => navigate("/lookup-order")}
          className="px-5 py-2 bg-[#009632] text-white font-medium rounded-lg shadow hover:bg-[#007a29] transition"
        >
          🔍 Track Order
        </button>
      </div>

      <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2">
        {orders.map((order) => {
          const firstItem = order.items[0];
          return (
            <div
              key={order.id}
              className="bg-white shadow-md hover:shadow-lg transition rounded-xl p-6 border border-gray-100"
            >
              {/* Header */}
              <div className="flex justify-between items-center mb-4">
                <p className="font-semibold text-gray-800 text-lg">
                  Order #{order.id}
                </p>
                <span className="text-sm text-gray-500">
                  {formatDate(order.date)}
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
                        order.status === "Delivered"
                          ? "text-green-600"
                          : order.status === "Failed"
                          ? "text-red-500"
                          : "text-yellow-600"
                      }`}
                    >
                      {order.status}
                    </span>
                  </p>
                </div>
              </div>

              {/* Items */}
              <ul className="space-y-2 text-gray-700">
                {order.items.map((item) => (
                  <li
                    key={item.id}
                    className="flex justify-between text-sm border-b border-gray-100 py-1"
                  >
                    <span>
                      {item.name} × {item.quantity}
                    </span>
                    <span className="font-medium">
                      ${(item.price * item.quantity).toFixed(2)}
                    </span>
                  </li>
                ))}
              </ul>

              {/* Footer */}
              <div className="mt-5 flex justify-between items-center">
                <span className="font-semibold text-gray-800">
                  Total: ${order.total.toFixed(2)}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
