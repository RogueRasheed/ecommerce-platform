import { useState, useEffect } from "react";
import OrdersPanel from "./OrdersPanel";
import ProductsPanel from "./ProductsPanel";
import { getDashboardStats } from "./api/adminApi";

interface DashboardStats {
  totalOrders: number;
  pending: number;
  shipped: number;
  delivered: number;
  cancelled: number;
  totalRevenue: number;
}

export default function AdminDashboard() {
  const [tab, setTab] = useState<"orders" | "products">("orders");
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loadingStats, setLoadingStats] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await getDashboardStats();
        setStats(data);
      } catch (err) {
        console.error("Failed to fetch dashboard stats:", err);
      } finally {
        setLoadingStats(false);
      }
    };
    fetchStats();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <h1 className="text-3xl font-bold mb-6 text-center text-[#009632]">
        Admin Dashboard
      </h1>

      {/* Stats Section */}
      {!loadingStats && stats && (
        <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
          <div className="bg-white p-4 rounded shadow text-center">
            <p className="text-gray-500">Total Orders</p>
            <p className="text-xl font-bold">{stats.totalOrders}</p>
          </div>
          <div className="bg-white p-4 rounded shadow text-center">
            <p className="text-gray-500">Pending</p>
            <p className="text-xl font-bold">{stats.pending}</p>
          </div>
          <div className="bg-white p-4 rounded shadow text-center">
            <p className="text-gray-500">Shipped</p>
            <p className="text-xl font-bold">{stats.shipped}</p>
          </div>
          <div className="bg-white p-4 rounded shadow text-center">
            <p className="text-gray-500">Delivered</p>
            <p className="text-xl font-bold">{stats.delivered}</p>
          </div>
          <div className="bg-white p-4 rounded shadow text-center">
            <p className="text-gray-500">Cancelled</p>
            <p className="text-xl font-bold">{stats.cancelled}</p>
          </div>
          <div className="bg-white p-4 rounded shadow text-center">
            <p className="text-gray-500">Revenue</p>
            <p className="text-xl font-bold">${stats.totalRevenue}</p>
          </div>
        </div>
      )}

      {/* Tab Buttons */}
      <div className="flex justify-center mb-8">
        <button
          className={`px-6 py-2 font-medium rounded-l-lg ${
            tab === "orders"
              ? "bg-[#009632] text-white"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          }`}
          onClick={() => setTab("orders")}
        >
          Orders
        </button>
        <button
          className={`px-6 py-2 font-medium rounded-r-lg ${
            tab === "products"
              ? "bg-[#009632] text-white"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          }`}
          onClick={() => setTab("products")}
        >
          Products
        </button>
      </div>

      {/* Panels */}
      <div className="max-w-6xl mx-auto">
        {tab === "orders" ? <OrdersPanel /> : <ProductsPanel />}
      </div>
    </div>
  );
}
