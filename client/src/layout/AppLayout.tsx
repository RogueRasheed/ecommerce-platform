import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";

export default function AppLayout() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Navbar stays on every page */}
      <Navbar />

      {/* Outlet links the layout to the pages in app.tsx */}
      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  );
}
