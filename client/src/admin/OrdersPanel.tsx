import { useEffect, useState } from "react";
import API_BASE_URL from "../config"; // keep this import

type Order = {
  _id: string;
  customerName: string;
  customerEmail?: string;
  customerPhone?: string;
  total: number;
  status: string;
  createdAt: string;
};

export default function OrdersPanel() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  async function fetchOrders(status?: string, search?: string) {
    try {
      setLoading(true);
      let url = `${API_BASE_URL}/admin/orders`;

      const params: string[] = [];
      if (status && status !== "all") params.push(`status=${status}`);
      if (search && search.trim() !== "") params.push(`search=${search}`);
      if (params.length > 0) url += `?${params.join("&")}`;

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
      fetchOrders(statusFilter, searchTerm);
    } catch (err) {
      console.error("❌ Failed to update order", err);
    }
  }

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    fetchOrders(statusFilter, searchTerm);
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
          onClick={() => fetchOrders(statusFilter, searchTerm)}
          className="bg-[#009632] text-white px-4 py-2 rounded hover:bg-green-700 transition"
        >
          Refresh
        </button>
      </div>

      {/* Filter + Search */}
      <div className="flex flex-wrap items-center gap-3 mb-4">
        <select
          className="border rounded px-3 py-2"
          value={statusFilter}
          onChange={(e) => {
            const selected = e.target.value;
            setStatusFilter(selected);
            fetchOrders(selected, searchTerm);
          }}
        >
          <option value="all">All Orders</option>
          <option value="pending">Pending</option>
          <option value="shipped">Shipped</option>
          <option value="delivered">Delivered</option>
          <option value="cancelled">Cancelled</option>
        </select>

        <form onSubmit={handleSearch} className="flex flex-1 gap-2">
          <input
            type="text"
            placeholder="Search by name, email, or phone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 border rounded px-3 py-2"
          />
          <button
            type="submit"
            className="bg-[#009632] text-white px-4 py-2 rounded hover:bg-green-700 transition"
          >
            Search
          </button>
        </form>
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
          {orders.length === 0 ? (
            <tr>
              <td colSpan={5} className="p-5 text-center text-gray-500">
                No orders found
              </td>
            </tr>
          ) : (
            orders.map((order) => (
              <tr key={order._id} className="border-b hover:bg-gray-50">
                <td className="p-3">
                  {order.customerName || "Unknown"}
                  <br />
                  <span className="text-sm text-gray-500">
                    {order.customerEmail || "No email"}
                  </span>
                </td>
                <td className="p-3">₦{order.total}</td>

                {/* Status Badge */}
                <td className="p-3 capitalize">
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      order.status === "pending"
                        ? "bg-yellow-100 text-yellow-800"
                        : order.status === "shipped"
                        ? "bg-blue-100 text-blue-800"
                        : order.status === "delivered"
                        ? "bg-green-100 text-green-800"
                        : order.status === "cancelled"
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
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
