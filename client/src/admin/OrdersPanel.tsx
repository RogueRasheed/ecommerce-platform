import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import API_BASE_URL from "../config";

type Order = {
  _id: string;
  customerName: string;
  customerEmail?: string;
  customerPhone?: string;
  total: number;
  status: string;
  createdAt: string;
  items?: { name: string; qty: number; price: number }[];
};

export default function OrdersPanel() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch all orders
  async function fetchOrders() {
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE_URL}/orders`);
      const data = await res.json();

      if (!Array.isArray(data)) throw new Error("Invalid data format");
      setOrders(data);
      setFilteredOrders(data);
    } catch (err) {
      console.error("❌ Failed to load orders", err);
      setOrders([]);
      setFilteredOrders([]);
    } finally {
      setLoading(false);
    }
  }

  // Update order status
async function updateStatus(id: string, status: string) {
  try {
    const res = await fetch(`${API_BASE_URL}/orders/${id}/status`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });

    if (!res.ok) throw new Error("Failed to update order");
    toast.success("Order status updated!");

    const updatedOrder = await res.json();

    // ✅ Instantly update the UI instead of reloading all orders
    setOrders((prevOrders) =>
      prevOrders.map((order) =>
        order._id === updatedOrder._id ? updatedOrder : order
      )
    );
  } catch (err) {
    console.error("❌ Failed to update order", err);
    toast.error("Failed to update order status");

  }
}


  // Filter + Search logic
  useEffect(() => {
    let filtered = [...orders];

    if (statusFilter !== "all") {
      filtered = filtered.filter((order) => order.status === statusFilter);
    }

    if (searchTerm.trim() !== "") {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (o) =>
          o.customerName.toLowerCase().includes(term) ||
          o.customerEmail?.toLowerCase().includes(term) ||
          o.customerPhone?.toLowerCase().includes(term)
      );
    }

    setFilteredOrders(filtered);
  }, [statusFilter, searchTerm, orders]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${API_BASE_URL}/orders`);
        const data = await res.json();

        if (!Array.isArray(data)) throw new Error("Invalid data format");
        setOrders(data);
        setFilteredOrders(data);
      } catch (err) {
        console.error("❌ Failed to load orders", err);
        setOrders([]);
        setFilteredOrders([]);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading)
    return <p className="text-center text-gray-600 mt-8">Loading orders...</p>;

  return (
    <div className="overflow-x-auto">
      {/* Header + Refresh */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
        <h2 className="text-2xl font-bold text-gray-800">Orders</h2>
        <button
          onClick={fetchOrders}
          className="bg-[#009632] text-white px-4 py-2 rounded hover:bg-green-700 transition"
        >
          Refresh
        </button>
      </div>

      {/* Filter + Search */}
      <div className="flex flex-wrap items-center gap-3 mb-6">
        <select
          className="border rounded px-3 py-2 shadow-sm"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="all">All Orders</option>
          <option value="processing">Processing</option>
          <option value="successful">Successful</option>
          <option value="failed">Failed</option>
          <option value="shipped">Shipped</option>
          <option value="delivered">Delivered</option>
          <option value="cancelled">Cancelled</option>
        </select>

        <input
          type="text"
          placeholder="Search by name, email, or phone..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1 border rounded px-3 py-2 shadow-sm"
        />
      </div>

      {/* Orders Table */}
      <table className="min-w-full border border-gray-200 bg-white rounded-lg shadow-md">
        <thead className="bg-gray-100 sticky top-0 z-10">
          <tr>
            <th className="p-3 border-b text-left">Customer</th>
            <th className="p-3 border-b text-left">Amount</th>
            <th className="p-3 border-b text-left">Items</th>
            <th className="p-3 border-b text-left">Status</th>
            <th className="p-3 border-b text-left">Date</th>
            <th className="p-3 border-b text-left">Action</th>
          </tr>
        </thead>
        <tbody>
          {filteredOrders.length === 0 ? (
            <tr>
              <td colSpan={6} className="p-5 text-center text-gray-500">
                No orders found
              </td>
            </tr>
          ) : (
            filteredOrders.map((order) => (
              <tr key={order._id} className="border-b hover:bg-gray-50 transition-all">
                <td className="p-3 font-medium">
                  {order.customerName}
                  <br />
                  <span className="text-sm text-gray-500">
                    {order.customerEmail}
                  </span>
                </td>
                <td className="p-3 font-semibold">₦{order.total.toLocaleString()}</td>
                <td className="p-3 text-sm text-gray-700">
                  {order.items ? order.items.length : 0} items
                </td>
                <td className="p-3">
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium capitalize ${
                      order.status === "pending"
                        ? "bg-yellow-100 text-yellow-800"
                        : order.status === "processing"
                        ? "bg-blue-100 text-blue-800"
                        : order.status === "successful"
                        ? "bg-green-100 text-green-800"
                        : order.status === "failed"
                        ? "bg-red-100 text-red-800"
                        : order.status === "cancelled"
                        ? "bg-gray-300 text-gray-800"
                        : order.status === "shipped"
                        ? "bg-purple-200 text-purple-800"
                        : order.status === "delivered"
                        ? "bg-indigo-200 text-indigo-800"
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
                    className="border rounded px-2 py-1 shadow-sm"
                    value={order.status}
                    onChange={(e) => updateStatus(order._id, e.target.value)}
                  >
                    <option value="processing">Processing</option>
                    <option value="successful">Successful</option>
                    <option value="failed">Failed</option>
                    <option value="delivered">Delivered</option>
                    <option value="cancelled">Cancelled</option>
                    <option value="shipped">Shipped</option>
                    <option value="pending">Pending</option>
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
