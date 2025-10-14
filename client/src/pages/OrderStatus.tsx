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
      } catch (err: unknown) {
        console.error("❌ Error fetching order:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [id]);

  if (loading) return <Loader />;
  if (!order) return <p className="text-center mt-10 text-gray-600">Order not found.</p>;

  const StatusSection = ({ title, color, message }: { title: string; color: string; message: string }) => (
    <div className="flex flex-col items-center justify-center min-h-screen text-center">
      <h1 className={`text-3xl font-bold mb-4 ${color}`}>{title}</h1>
      <p className="text-gray-600">{message}</p>
      <div className="mt-12">
        <Link
          to="/order-history"
          className="px-6 py-2 bg-[#009632] text-white rounded-lg shadow hover:bg-[#007a29]"
        >
          Back to Orders
        </Link>
      </div>
    </div>
  );

  switch (order.status) {
    case "successful":
      return <StatusSection title="Order Successful 🎉" color="text-green-600" message={`Your order #${order._id} has been placed successfully.`} />;
    case "failed":
      return <StatusSection title="Payment Failed ❌" color="text-red-600" message="Something went wrong with your payment. Please try again." />;
    case "delivered":
      return <StatusSection title="Order Delivered 🚚" color="text-blue-600" message="Your order has been successfully delivered. Enjoy!" />;
    default:
      return (
        <div className="flex flex-col items-center justify-center min-h-screen text-center">
          <h1 className="text-3xl font-bold text-yellow-600 mb-4">Order Processing ⏳</h1>
          <p className="text-gray-600 mb-4">Your order #{order._id} is currently being processed.</p>
          <div className="w-64 bg-gray-200 h-2 rounded-full overflow-hidden">
            <div className="bg-yellow-500 h-2 w-1/2 animate-pulse" />
          </div>
          <div className="mt-12">
            <Link
              to="/order-history"
              className="px-6 py-2 bg-[#009632] text-white rounded-lg shadow hover:bg-[#007a29]"
            >
              Back to Orders
            </Link>
          </div>
        </div>
      );
  }
}
