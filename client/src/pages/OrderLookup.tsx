import { useState } from "react";

type OrderItem = {
  productId: string;
  name: string;
  price: number;
  qty: number;
};

type Order = {
  _id: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  total: number;
  status: "processing" | "successful" | "failed" | "delivered";
  createdAt: string;
  items: OrderItem[];
};

export default function OrderLookup() {
  const [input, setInput] = useState("");
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [expanded, setExpanded] = useState<string | null>(null);

  const handleLookup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setOrders([]);

    try {
      const isEmail = input.includes("@");
      const queryParam = isEmail
        ? `email=${encodeURIComponent(input)}`
        : `phone=${encodeURIComponent(input)}`;

      const res = await fetch(
        `https://ecommerce-platform-jkg6.onrender.com/api/orders/lookup/customer?${queryParam}`
      );

      if (!res.ok) throw new Error("No orders found for this input");

      const data = await res.json();
      setOrders(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: Order["status"]) => {
    switch (status) {
      case "processing":
        return "bg-yellow-100 text-yellow-700";
      case "successful":
        return "bg-green-100 text-green-700";
      case "failed":
        return "bg-red-100 text-red-700";
      case "delivered":
        return "bg-blue-100 text-blue-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-6 py-12 relative">
      {/* Top Right Button */}
      <div className="absolute right-6 top-6">
        <a
          href="/order-history"
          className="px-5 py-2 bg-[#009632] text-white rounded-lg shadow hover:bg-[#007a29] transition"
        >
          View Order History
        </a>
      </div>

      <h1 className="text-3xl font-bold mb-8 text-gray-800 text-center">
        Order Lookup
      </h1>

      {/* Lookup Form */}
      <form
        onSubmit={handleLookup}
        className="flex flex-col sm:flex-row gap-4 justify-center mb-8"
      >
        <input
          type="text"
          placeholder="Enter your email or phone number"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="w-full sm:w-2/3 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#009632] focus:outline-none"
          required
        />
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-2 bg-[#009632] text-white rounded-lg shadow hover:bg-[#00812b] disabled:opacity-60"
        >
          {loading ? "Loading..." : "Lookup"}
        </button>
      </form>

      {/* Error Message */}
      {error && (
        <p className="text-center text-red-500 font-medium mb-4">{error}</p>
      )}

      {/* Orders List */}
      {orders.length > 0 ? (
        <div className="space-y-6 animate-fadeIn">
          {orders.map((order) => (
            <div
              key={order._id}
              className="bg-white border rounded-xl shadow-sm p-6 transition hover:shadow-md"
            >
              <div className="flex justify-between items-center border-b pb-3 mb-3">
                <div>
                  <p className="font-semibold text-gray-800">
                    Order #{order._id.slice(-6)}
                  </p>
                  <p className="text-sm text-gray-500">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <span
                  className={`px-3 py-1 text-sm rounded-full font-medium ${getStatusColor(
                    order.status
                  )}`}
                >
                  {order.status.charAt(0).toUpperCase() +
                    order.status.slice(1)}
                </span>
              </div>

              <div className="flex justify-between items-center">
                <p className="font-semibold text-gray-800">
                  Total: ${order.total.toFixed(2)}
                </p>
                <button
                  onClick={() =>
                    setExpanded(expanded === order._id ? null : order._id)
                  }
                  className="text-[#009632] font-medium hover:underline"
                >
                  {expanded === order._id ? "Hide Details" : "View Details"}
                </button>
              </div>

              {expanded === order._id && (
                <ul className="mt-4 space-y-2 text-gray-700 border-t pt-3">
                  {order.items.map((item, idx) => (
                    <li
                      key={idx}
                      className="flex justify-between text-sm border-b py-1"
                    >
                      <span>
                        {item.name} × {item.qty}
                      </span>
                      <span className="font-medium">
                        ${(item.price * item.qty).toFixed(2)}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      ) : (
        !loading &&
        !error && (
          <p className="text-center text-gray-600">
            Enter your email or phone number to see your order history.
          </p>
        )
      )}
    </div>
  );
}