import { useEffect, useState } from "react";
import API_BASE_URL from "../config";

type Order = {
  _id: string;
  user?: {
    name: string;
    email: string;
    phone: string;
  };
  total: number;
  status: string;
  createdAt: string;
};

export default function OrdersPanel() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("all");

  async function fetchOrders(status?: string) {
    try {
      setLoading(true);
      let url = `${API_BASE_URL}/admin/orders`;
      if (status && status !== "all") url += `?status=${status}`;
      const res = await fetch(url);
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
      fetchOrders(statusFilter); // refresh list with current filter
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
      {/* Header + Refresh */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Orders</h2>
        <button
          onClick={() => fetchOrders(statusFilter)}
          className="bg-[#009632] text-white px-4 py-2 rounded hover:bg-green-700 transition"
        >
          Refresh
        </button>
      </div>

      {/* Filter Dropdown */}
      <div className="mb-4">
        <select
          className="border rounded px-3 py-2"
          value={statusFilter}
          onChange={(e) => {
            const selected = e.target.value;
            setStatusFilter(selected);
            fetchOrders(selected);
          }}
        >
          <option value="all">All Orders</option>
          <option value="pending">Pending</option>
          <option value="shipped">Shipped</option>
          <option value="delivered">Delivered</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      {/* Orders Table */}
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
              <td className="p-3">
                {order.user?.name || "Unknown"}
                <br />
                <span className="text-sm text-gray-500">
                  {order.user?.email || "No email"}
                </span>
              </td>
              <td className="p-3">₦{order.total}</td>

              {/* Colored Status Badge */}
              <td className="p-3 capitalize">
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                    order.status.toLowerCase() === "pending"
                      ? "bg-yellow-100 text-yellow-800"
                      : order.status.toLowerCase() === "shipped"
                      ? "bg-blue-100 text-blue-800"
                      : order.status.toLowerCase() === "delivered"
                      ? "bg-green-100 text-green-800"
                      : order.status.toLowerCase() === "cancelled"
                      ? "bg-red-100 text-red-800"
                      : "bg-gray-100 text-gray-800"
                  }`}
                >
                  {order.status}
                </span>
              </td>

              <td className="p-3">
                {new Date(order.createdAt).toLocaleDateString()}
              </td>

              {/* Status Update Dropdown */}
              <td className="p-3">
                <select
                  className="border rounded px-2 py-1"
                  value={order.status}
                  onChange={(e) => updateStatus(order._id, e.target.value)}
                >
                  <option value="pending">Pending</option>
                  <option value="shipped">Shipped</option>
                  <option value="delivered">Delivered</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
