import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

type OrderItem = {
  id: number;
  name: string;
  price: number;
  quantity: number;
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
    if (savedOrders) {
      setOrders(JSON.parse(savedOrders));
    }
  }, []);

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
          className="mt-6 inline-block px-6 py-2 bg-[#009632] text-white rounded-lg shadow hover:bg-[#009632]"
        >
          Browse Products
        </a>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <h1 className="text-3xl font-bold mb-8 text-gray-800">📦 Order History</h1>

      <div className="space-y-6">
        {orders.map((order) => (
          <div
            key={order.id}
            className="bg-white shadow rounded-xl p-6 border border-gray-200"
          >
            {/* Order Header */}
            <div className="flex justify-between items-center border-b pb-3 mb-4">
              <p className="font-semibold text-gray-800">Order #{order.id}</p>
              <p className="text-sm text-gray-500">{order.date}</p>
            </div>

            {/* Items */}
            <ul className="space-y-2 text-gray-700">
              {order.items.map((item) => (
                <li
                  key={item.id}
                  className="flex justify-between text-sm border-b py-1"
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

            {/* Total + Track button */}
            <div className="mt-4 flex justify-between items-center">
              <span className="font-semibold text-gray-800">
                Total: ${order.total.toFixed(2)}
              </span>
              <button
                onClick={() =>
                 navigate(`/order/${order.id}/${order.status.toLowerCase()}`)
                }
                className="px-4 py-2 bg-[#009632] text-white rounded-lg hover:bg-[#009632]"
              >
                Track Order
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
