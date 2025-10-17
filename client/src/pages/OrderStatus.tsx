import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import Loader from "../components/Loader";

interface OrderItem {
  productId: string;
  name: string;
  price: number;
  qty: number;
}

interface Order {
  _id: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  customerAddress: string;
  items: OrderItem[];
  total: number;
  status: "processing" | "successful" | "failed" | "delivered" | "cancelled" | "shipped" | "pending";
}

export default function OrderStatusPage() {
  const { id } = useParams<{ id: string }>();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await fetch(`https://ecommerce-platform-jkg6.onrender.com/api/orders/${id}`);
        if (!res.ok) throw new Error("Failed to fetch order");
        const data: Order = await res.json();
        setOrder(data);
      } catch (err) {
        console.error("❌ Error fetching order:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [id]);

  if (loading) return <Loader />;
  if (!order) return <p className="text-center mt-10 text-gray-600">Order not found.</p>;

  const statusColor =
    order.status === "successful"
      ? "text-green-600"
      : order.status === "failed"
      ? "text-red-600"
      : order.status === "delivered"
      ? "text-blue-600"
      : "text-yellow-600";

  const statusEmoji =
    order.status === "successful"
      ? "🎉"
      : order.status === "failed"
      ? "❌"
      : order.status === "delivered"
      ? "🚚"
      : "⏳";

  return (
    <div className="min-h-screen bg-gray-50 py-16 px-6">
      <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-lg p-8 relative overflow-hidden">
        <div className="text-center border-b pb-6 mb-6">
          <h1 className={`text-3xl font-bold mb-2 ${statusColor}`}>
            Order {order.status.charAt(0).toUpperCase() + order.status.slice(1)} {statusEmoji}
          </h1>
          <p className="text-gray-600">Order ID: <span className="font-medium">{order._id}</span></p>
          <p className="text-sm text-gray-500 mt-1">Thank you for shopping with us!</p>
        </div>

        {/* Customer Info */}
        <div className="grid sm:grid-cols-2 gap-6 mb-8">
          <div>
            <h2 className="font-semibold text-gray-700 mb-2">Customer Details</h2>
            <p className="text-gray-600">{order.customerName}</p>
            <p className="text-gray-600">{order.customerEmail}</p>
            <p className="text-gray-600">{order.customerPhone}</p>
          </div>
          <div>
            <h2 className="font-semibold text-gray-700 mb-2">Shipping Address</h2>
            <p className="text-gray-600">{order.customerAddress}</p>
          </div>
        </div>

        {/* Items List */}
        <div className="border-t pt-4">
          <h2 className="font-semibold text-gray-700 mb-3">Order Items</h2>
          <ul className="divide-y">
            {order.items.map((item) => (
              <li key={item.productId} className="flex justify-between py-3">
                <div>
                  <p className="font-medium text-gray-800">{item.name}</p>
                  <p className="text-sm text-gray-500">Qty: {item.qty}</p>
                </div>
                <p className="font-semibold text-gray-700">
                  ${(item.price * item.qty).toFixed(2)}
                </p>
              </li>
            ))}
          </ul>

          <div className="flex justify-between items-center border-t mt-4 pt-4 text-lg font-bold text-gray-800">
            <span>Total</span>
            <span>${order.total.toFixed(2)}</span>
          </div>
        </div>

        {/* Progress or Status Message */}
        {order.status === "processing" && (
          <div className="mt-8 flex flex-col items-center">
            <p className="text-gray-600 mb-3">Your order is currently being processed.</p>
            <div className="w-2/3 bg-gray-200 h-2 rounded-full overflow-hidden">
              <div className="bg-yellow-500 h-2 w-1/2 animate-pulse"></div>
            </div>
          </div>
        )}

        {/* Action Button */}
        <div className="text-center mt-10">
          <Link
            to="/order-history"
            className="px-6 py-2 bg-[#009632] text-white rounded-lg shadow hover:bg-[#007a29] transition-all"
          >
            Back to Orders
          </Link>
        </div>
      </div>
    </div>
  );
}
