import { Routes, Route } from "react-router-dom";
import AppLayout from "./layout/AppLayout";
import Home from "./pages/Home";
import Products from "./pages/Products";
import Cart from "./pages/Cart";
import About from "./pages/About";
import Contact from "./pages/Contact";
import CheckoutPage from "./pages/CheckoutPage";
import ProductDetails from "./pages/ProductDetails";
import OrderStatus from "./pages/OrderStatus";
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
          <Route path="/products/:id" element={<ProductDetails />} />
          <Route path="/orders/:id" element={<OrderStatus />} />
          <Route path="/lookup-order" element={<OrderLookup />} />
        </Route>
      </Routes>
      <Toaster position="top-right" reverseOrder={false} />
    </>
  );
}
