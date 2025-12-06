import { useEffect, useState, useCallback } from "react";
import { useParams, Link, useLocation } from "react-router-dom";
import Loader from "../components/Loader";
import toast from "react-hot-toast";
import { API_BASE_URL } from "../config";

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
  paymentReference?: string;
}

export default function OrderStatusPage() {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [verificationStatus, setVerificationStatus] = useState<'IDLE' | 'VERIFYING' | 'VERIFIED' | 'FAILED'>('IDLE');

  const fetchOrder = useCallback(async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/orders/${id}`);
      if (!res.ok) throw new Error("Failed to fetch order");
      const data: Order = await res.json();
      setOrder(data);
      return data;
    } catch (err) {
      console.error("❌ Error fetching order:", err);
      return null;
    }
  }, [id]);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const paystackRef = params.get('trxref');

    const handleVerification = async (reference: string) => {
      setVerificationStatus('VERIFYING');
      try {
        const verifyRes = await fetch(`${API_BASE_URL}/payments/verify/${reference}`);
        const verifyData = await verifyRes.json();

        if (!verifyRes.ok) {
          toast.error(verifyData.error || "❌ Payment verification failed.");
          setVerificationStatus('FAILED');
        } else {
          toast.success(`🎉 Payment verified!`);
          setVerificationStatus('VERIFIED');
        }
      } catch (err) {
        console.error("❌ Error during verification:", err);
        toast.error("❌ Error communicating with the payment server.");
        setVerificationStatus('FAILED');
      }

      await fetchOrder();
      setLoading(false);
    };

    if (paystackRef) {
      handleVerification(paystackRef);
    } else {
      fetchOrder().then(() => setLoading(false));
    }
  }, [id, location.search, fetchOrder]);

  if (loading || verificationStatus === 'VERIFYING')
    return <Loader message={verificationStatus === 'VERIFYING' ? 'Verifying payment...' : 'Loading order...'} />;

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
        {verificationStatus === 'FAILED' && order.status !== 'successful' && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6" role="alert">
            <p className="font-bold">Verification Warning</p>
            <p className="text-sm">We could not confirm the payment. Please check your order status below.</p>
          </div>
        )}

        <div className="text-center border-b pb-6 mb-6">
          <h1 className={`text-3xl font-bold mb-2 ${statusColor}`}>
            Order {order.status.charAt(0).toUpperCase() + order.status.slice(1)} {statusEmoji}
          </h1>
          <p className="text-gray-600">Order ID: <span className="font-medium">{order._id}</span></p>
          {order.paymentReference && (
            <p className="text-sm text-gray-500 mt-1">Paystack Ref: {order.paymentReference}</p>
          )}
          <p className="text-sm text-gray-500 mt-1">Thank you for shopping with us!</p>
        </div>

        {/* Customer Info, Items List, Progress/Status Message JSX omitted for brevity */}

        <div className="text-center mt-10">
          <Link
            to="/"
            className="px-6 py-2 bg-[#009632] text-white rounded-lg shadow hover:bg-[#007a29] transition-all"
          >
            Back to Store
          </Link>
        </div>
      </div>
    </div>
  );
}