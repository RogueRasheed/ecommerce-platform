import { useEffect, useState } from "react";
import API_BASE_URL from "../config";

type DashboardStats = {
  totalOrders: number;
  pending: number;
  shipped: number;
  delivered: number;
  cancelled: number;
  totalRevenue: number;
};

export default function DashboardStats() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  async function fetchStats() {
    try {
      const res = await fetch(`${API_BASE_URL}/admin/dashboard/stats`);
      const data = await res.json();
      setStats(data);
    } catch (err) {
      console.error("❌ Failed to load dashboard stats", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchStats();
  }, []);

  if (loading) return <p className="text-center">Loading dashboard...</p>;
  if (!stats) return <p className="text-center text-red-500">Failed to load stats.</p>;

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <h1 className="text-2xl font-bold mb-6 text-center text-[#009632]">
        Dashboard Overview
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
        {/* Total Orders */}
        <StatCard title="Total Orders" value={stats.totalOrders} color="bg-blue-100 text-blue-800" />

        {/* Pending */}
        <StatCard title="Pending" value={stats.pending} color="bg-yellow-100 text-yellow-800" />

        {/* Shipped */}
        <StatCard title="Shipped" value={stats.shipped} color="bg-indigo-100 text-indigo-800" />

        {/* Delivered */}
        <StatCard title="Delivered" value={stats.delivered} color="bg-green-100 text-green-800" />

        {/* Cancelled */}
        <StatCard title="Cancelled" value={stats.cancelled} color="bg-red-100 text-red-800" />

        {/* Revenue */}
        <StatCard
          title="Total Revenue"
          value={`₦${stats.totalRevenue.toLocaleString()}`}
          color="bg-gray-100 text-gray-800"
        />
      </div>
    </div>
  );
}

function StatCard({
  title,
  value,
  color,
}: {
  title: string;
  value: string | number;
  color: string;
}) {
  return (
    <div className={`p-6 rounded-xl shadow-md border ${color} text-center`}>
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className="text-3xl font-bold">{value}</p>
    </div>
  );
}
