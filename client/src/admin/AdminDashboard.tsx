import { useState } from "react";
import OrdersPanel from "./OrdersPanel";
import ProductsPanel from "./ProductsPanel";
import DashboardStats from "./DashboardStats";
import MessagesPanel from "./MessagePanel";

export default function AdminDashboard() {
  const [tab, setTab] = useState<"dashboard" | "orders" | "products" | "messages">("dashboard");

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <h1 className="text-3xl font-bold mb-6 text-center text-[#009632]">
        Admin Dashboard
      </h1>

      {/* Navigation Tabs */}
      <div className="flex justify-center mb-8">
        <button
          className={`px-6 py-2 font-medium rounded-l-lg ${
            tab === "dashboard"
              ? "bg-[#009632] text-white"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          }`}
          onClick={() => setTab("dashboard")}
        >
          Dashboard
        </button>
        <button
          className={`px-6 py-2 font-medium ${
            tab === "orders"
              ? "bg-[#009632] text-white"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          }`}
          onClick={() => setTab("orders")}
        >
          Orders
        </button>
        <button
          className={`px-6 py-2 font-medium ${
            tab === "products"
              ? "bg-[#009632] text-white"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          }`}
          onClick={() => setTab("products")}
        >
          Products
        </button>
        <button
          className={`px-6 py-2 font-medium rounded-r-lg ${
            tab === "messages"
              ? "bg-[#009632] text-white"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          }`}
          onClick={() => setTab("messages")}
         >
          Messages
        </button>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto">
        {tab === "dashboard" && <DashboardStats />}
        {tab === "orders" && <OrdersPanel />}
        {tab === "products" && <ProductsPanel />}
        {tab === "messages" && <MessagesPanel />}

      </div>
    </div>
  );
}
