import { useState } from "react";
import { medusa } from "../lib/medusa";

type OrderItem = {
  id: string;
  title: string;
  unit_price: number;
  quantity: number;
};

type OrderStatus =
  | "pending"
  | "completed"
  | "archived"
  | "canceled";

type Order = {
  id: string;
  display_id: number;
  email: string;
  total: number;
  status: OrderStatus;
  created_at: string;
  items: OrderItem[];
};

export default function OrderLookup() {
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
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
      const params = new URLSearchParams({
        email: email.trim(),
        phone: phone.trim(),
      });

      const baseUrl = import.meta.env.VITE_MEDUSA_BACKEND_URL as string;
      const publishableKey = import.meta.env.VITE_MEDUSA_PUBLISHABLE_KEY as string;

      const res = await fetch(
        `${baseUrl}/store/orders/lookup?${params.toString()}`,
        {
          headers: {
            "x-publishable-api-key": publishableKey,
          },
        }
      );

      if (!res.ok) {
        const body = await res.json().catch(() => null);
        throw new Error(body?.message ?? "No orders found for these details.");
      }

      const data: { orders: Order[] } = await res.json();
      setOrders(data.orders);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: OrderStatus) => {
    const colors: Record<OrderStatus, string> = {
      pending: "bg-yellow-100 text-yellow-700",
      completed: "bg-green-100 text-green-700",
      archived: "bg-blue-100 text-blue-700",
      canceled: "bg-red-100 text-red-700",
    };
    return colors[status] || "bg-gray-100 text-gray-700";
  };

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });

  return (
    <div className="max-w-3xl mx-auto px-6 py-12">
      <h1 className="text-3xl font-bold mb-8 text-gray-800 text-center">
        Order Lookup
      </h1>

      <form
        onSubmit={handleLookup}
        className="max-w-xl mx-auto space-y-4 mb-8"
      >
        <input
          type="email"
          placeholder="Email used for your order"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#009632] focus:outline-none"
          required
        />

        <input
          type="tel"
          placeholder="Phone number used for your order"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#009632] focus:outline-none"
          required
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full px-6 py-2 bg-[#009632] text-white rounded-lg shadow hover:bg-[#00812b] disabled:opacity-60"
        >
          {loading ? "Loading..." : "Lookup Orders"}
        </button>
      </form>

      {error && (
        <p className="text-center text-red-500 font-medium mb-4">{error}</p>
      )}

      {orders.length > 0 ? (
        <div className="space-y-6">
          {orders.map((order) => (
            <div
              key={order.id}
              className="bg-white border rounded-xl shadow-sm p-6 transition hover:shadow-md"
            >
              <div className="flex justify-between items-center border-b pb-3 mb-3">
                <div>
                  <p className="font-semibold text-gray-800">
                    Order #{order.display_id}
                  </p>
                  <p className="text-sm text-gray-500">
                    {formatDate(order.created_at)}
                  </p>
                </div>
                <span
                  className={`px-3 py-1 text-sm rounded-full font-medium ${getStatusColor(
                    order.status
                  )}`}
                >
                  {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                </span>
              </div>

              <div className="flex justify-between items-center">
                <p className="font-semibold text-gray-800">
                  Total: ₦{order.total.toLocaleString()}
                </p>
                <button
                  onClick={() =>
                    setExpanded(expanded === order.id ? null : order.id)
                  }
                  className="text-[#009632] font-medium hover:underline"
                >
                  {expanded === order.id ? "Hide Details" : "View Details"}
                </button>
              </div>

              {expanded === order.id && (
                <ul className="mt-4 space-y-2 text-gray-700 border-t pt-3">
                  {order.items.map((item) => (
                    <li
                      key={item.id}
                      className="flex justify-between text-sm border-b py-1"
                    >
                      <span>
                        {item.title} × {item.quantity}
                      </span>
                      <span className="font-medium">
                        ₦{(item.unit_price * item.quantity).toLocaleString()}
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
            Enter the email and phone number used for your order to see your
            previous orders.
          </p>
        )
      )}
    </div>
  );
}
