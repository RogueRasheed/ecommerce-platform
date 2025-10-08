import { useEffect, useState } from "react";
import API_BASE_URL from "../config";

type Order = {
  _id: string;
  customerName: string;
  totalAmount: number;
  status: string;
  createdAt: string;
};

export default function OrdersPanel() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  async function fetchOrders() {
    try {
      const res = await fetch(`${API_BASE_URL}/admin/orders`);
      const data = await res.json();
      setOrders(data);
    } catch (err) {
      console.error("❌ Failed to load orders", err);
    } finally {
      setLoading(false);
    }
  }

  async function updateStatus(id: string, status: string) {
    try {
      await fetch(`${API_BASE_URL}/admin/orders/${id}/status`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      fetchOrders(); // refresh list
    } catch (err) {
      console.error("❌ Failed to update order", err);
    }
  }

  useEffect(() => {
    fetchOrders();
  }, []);

  if (loading) return <p className="text-center">Loading orders...</p>;

  return (
    <div className="overflow-x-auto">
      <table className="w-full border border-gray-200 bg-white rounded-lg shadow-md">
        <thead className="bg-gray-100 text-left">
          <tr>
            <th className="p-3 border-b">Customer</th>
            <th className="p-3 border-b">Amount</th>
            <th className="p-3 border-b">Status</th>
            <th className="p-3 border-b">Date</th>
            <th className="p-3 border-b">Action</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order._id} className="border-b hover:bg-gray-50">
              <td className="p-3">{order.customerName}</td>
              <td className="p-3">₦{order.totalAmount}</td>
              <td className="p-3 capitalize">{order.status}</td>
              <td className="p-3">
                {new Date(order.createdAt).toLocaleDateString()}
              </td>
              <td className="p-3">
                <select
                  className="border rounded px-2 py-1"
                  value={order.status}
                  onChange={(e) => updateStatus(order._id, e.target.value)}
                >
                  <option value="Pending">Pending</option>
                  <option value="Processing">Processing</option>
                  <option value="Completed">Completed</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
