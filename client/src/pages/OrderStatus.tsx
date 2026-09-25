import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import Loader from "../components/Loader";
import { medusa } from "../lib/medusa";

// Minimal shape of what we read off a Medusa order — Medusa's real type is
// much bigger, we only need these fields for the confirmation page.
type MedusaOrderItem = {
  id: string;
  title: string;
  quantity: number;
  unit_price: number;
};

type MedusaOrder = {
  id: string;
  display_id: number;
  email: string;
  items?: MedusaOrderItem[];
  total: number;
  shipping_address?: { address_1: string; city: string } | null;
};

export default function OrderStatusPage() {
  const { id } = useParams<{ id: string }>();
  const [order, setOrder] = useState<MedusaOrder | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!id) return;
    medusa.store.order
      .retrieve(id, { fields: "*items,*shipping_address" })
      .then(({ order }) => setOrder(order as unknown as MedusaOrder))
      .catch((err) => {
        console.error("Failed to fetch order:", err);
        setNotFound(true);
      })
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <Loader message="Loading your order..." />;

  if (notFound || !order) {
    return (
      <div className="max-w-xl mx-auto px-6 py-16 text-center">
        <h1 className="text-2xl font-bold mb-4">Order not found</h1>
        <p className="text-gray-600">
          We couldn't find that order. If you just paid, check your email for a receipt, or contact us.
        </p>
        <Link to="/" className="mt-6 inline-block px-6 py-2 bg-[#009632] text-white rounded-lg shadow hover:bg-[#007a29]">
          Back to Store
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-16 px-6">
      <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-lg p-8">
        <div className="text-center border-b pb-6 mb-6">
          <h1 className="text-3xl font-bold mb-2 text-green-600">Order confirmed 🎉</h1>
          <p className="text-gray-600">
            Order <span className="font-medium">#{order.display_id}</span>
          </p>
          <p className="text-sm text-gray-500 mt-1">A confirmation has been sent to {order.email}.</p>
        </div>

        <div className="divide-y mb-6">
          {order.items?.map((item) => (
            <div key={item.id} className="flex items-center justify-between py-3">
              <div>
                <p className="font-medium">{item.title}</p>
                <p className="text-sm text-gray-500">Qty {item.quantity}</p>
              </div>
              <p className="font-semibold">₦{(item.unit_price * item.quantity).toLocaleString()}</p>
            </div>
          ))}
        </div>

        {order.shipping_address && (
          <p className="text-sm text-gray-500 mb-6">
            Delivering to {order.shipping_address.address_1}, {order.shipping_address.city}
          </p>
        )}

        <div className="flex justify-between text-lg font-bold border-t pt-4 mb-8">
          <span>Total paid</span>
          <span>₦{order.total.toLocaleString()}</span>
        </div>

        <div className="text-center">
          <Link to="/" className="px-6 py-2 bg-[#009632] text-white rounded-lg shadow hover:bg-[#007a29] transition-all">
            Back to Store
          </Link>
        </div>
      </div>
    </div>
  );
}
