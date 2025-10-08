import { useState } from "react";
import OrdersPanel from "./OrdersPanel";
import ProductsPanel from "./ProductsPanel";

export default function AdminDashboard() {
  const [tab, setTab] = useState<"orders" | "products">("orders");

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <h1 className="text-3xl font-bold mb-6 text-center text-[#009632]">
        Admin Dashboard
      </h1>

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

      <div className="max-w-6xl mx-auto">
        {tab === "orders" ? <OrdersPanel /> : <ProductsPanel />}
      </div>
    </div>
  );
}
