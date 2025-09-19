import { ShoppingCart, Menu, X } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useCart } from "../store/useCart";
import  useSearch  from "../utils/SearchHook";
import { useEffect, useState } from "react";
import LogoImg from "../assets/Logoupscale.png";

export default function Navbar() {
  const { cart } = useCart();
  const { searchQuery, setSearchQuery } = useSearch();
  const totalItems = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);

  const location = useLocation();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    if (searchQuery && location.pathname !== "/products") {
      navigate("/products");
    }
  }, [searchQuery, location, navigate]);

  return (
    <nav className="w-full bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 py-2 flex items-center justify-between gap-4">
       {/* Logo */}
        <Link to="/" className="flex items-center">
          <img 
            src={LogoImg} 
            alt="ShopEase Logo" 
            className="h-15 w-33" 
          />
        </Link>




        {/* Desktop Links */}
        <div className="hidden md:flex gap-6 text-gray-700 font-medium">
          <Link to="/" className="hover:text-blue-600 transition">Home</Link>
          <Link to="/products" className="hover:text-blue-600 transition">Products</Link>
          <Link to="/contact" className="hover:text-blue-600 transition">Contact</Link>
          <Link to="/order-history" className="hover:text-blue-600 transition">Order History</Link>
        </div>

        {/* Search Bar (hidden on mobile) */}
        <div className="hidden md:flex flex-1 max-w-sm">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search products..."
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
          />
        </div>

        {/* Cart */}
        <Link to="/cart" className="relative cursor-pointer">
          <ShoppingCart className="w-6 h-6 text-gray-700 hover:text-blue-600 transition" />
          {totalItems > 0 && (
            <span className="absolute -top-2 -right-2 bg-blue-600 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
              {totalItems}
            </span>
          )}
        </Link>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-gray-700"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden bg-white border-t border-gray-200 flex flex-col gap-4 px-6 py-4 text-gray-700 font-medium">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search products..."
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
          />
          <Link to="/" className="hover:text-blue-600 transition" onClick={() => setMobileOpen(false)}>Home</Link>
          <Link to="/products" className="hover:text-blue-600 transition" onClick={() => setMobileOpen(false)}>Products</Link>
          <Link to="/order-history" className="hover:text-blue-600 transition" onClick={() => setMobileOpen(false)}>Order History</Link>
          <Link to="/about" className="hover:text-blue-600 transition" onClick={() => setMobileOpen(false)}>About</Link>
          <Link to="/contact" className="hover:text-blue-600 transition" onClick={() => setMobileOpen(false)}>Contact</Link>
        </div>
      )}
    </nav>
  );
}
