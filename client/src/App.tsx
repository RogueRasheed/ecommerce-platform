import { Routes, Route } from "react-router-dom";
import AppLayout from "./layout/AppLayout";
import Home from "./pages/Home";
import Products from "./pages/Products";
import Cart from "./pages/Cart";
import About from "./pages/About";
import Contact from "./pages/Contact";
import CheckoutPage from "./pages/CheckoutPage";
import OrderConfirmation from "./components/OrderConfirmation";
import OrderHistory from "./pages/OrderHistory";
import ProductDetails from "./pages/ProductDetails";
import OrderStatus from "./pages/OrderStatus";
import AdminDashboard from "./admin/AdminDashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import Login from "./pages/Login";
import { Toaster } from "react-hot-toast";
import OrderLookup from "./pages/OrderLookup";
export default function App() {
  return (
   <>
   <Routes>
      <Route element={<AppLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/products" element={<Products />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/order-confirmation" element={<OrderConfirmation />} />
        <Route path="/order-history" element={<OrderHistory />} />
        <Route path="/products/:id" element={<ProductDetails />} />
        <Route path="/order/:id/status" element={<OrderStatus />} />
        <Route path="/lookup-order" element={<OrderLookup />} />
        <Route
          path="/admin" element={
          <ProtectedRoute adminOnly>
            <AdminDashboard />
          </ProtectedRoute>
            } />
        <Route path="/login" element={<Login />} />

      </Route>
    </Routes>
    <Toaster position="top-right" reverseOrder={false} />
   </>
  );
}
