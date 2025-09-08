import { useEffect, useState } from "react";

type Order = {
  _id: string;
  customerName: string;
  items: { name: string; qty: number; price: number }[];
  total: number;
  status: "processing" | "successful" | "failed" | "delivered";
};

export default function AdminOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  // ✅ Fetch all orders
  useEffect(() => {
    fetch("/api/orders")
      .then((res) => res.json())
      .then((data) => {
        setOrders(data);
        setLoading(false);
      });
  }, []);

  // ✅ Update status
const updateStatus = async (id: string, status: Order["status"]) => {
  await fetch(`/api/orders/${id}/status`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status }),
  });

  setOrders((prev) =>
    prev.map((o) => (o._id === id ? { ...o, status } : o))
  );
};

  

  if (loading) return <p className="text-center py-20">Loading orders...</p>;

  return (
    <section className="py-20 bg-gray-50 text-gray-900">
      <div className="max-w-6xl mx-auto px-6">
        <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">
          Admin Orders
        </h2>

        <div className="overflow-x-auto bg-white rounded-2xl shadow-md">
          <table className="w-full table-auto text-left">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-3">Order ID</th>
                <th className="px-4 py-3">Customer</th>
                <th className="px-4 py-3">Items</th>
                <th className="px-4 py-3">Total</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Action</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order._id} className="border-b">
                  <td className="px-4 py-3">{order._id}</td>
                  <td className="px-4 py-3">{order.customerName}</td>
                  <td className="px-4 py-3">
                    {order.items.map((item, i) => (
                      <span key={i}>
                        {item.qty}x {item.name}
                        {i < order.items.length - 1 && ", "}
                      </span>
                    ))}
                  </td>
                  <td className="px-4 py-3">${order.total}</td>
                  <td className="px-4 py-3">
                    <select
                      value={order.status}
                      onChange={(e) =>
                        updateStatus(order._id, e.target.value as Order["status"]) // 👈 cast to valid type
                    }
                    className="border rounded-lg px-2 py-1"
                    >
                    <option value="processing">Processing</option>
                    <option value="successful">Successful</option>
                    <option value="failed">Failed</option>
                    <option value="delivered">Delivered</option>
                    </select>
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() =>
                        updateStatus(order._id, order.status)
                      }
                      className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition font-medium"
                    >
                      Save
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
