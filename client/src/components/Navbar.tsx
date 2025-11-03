import { ShoppingCart, Menu, X } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useCart } from "../store/useCart";
import  useSearch  from "../utils/SearchHook";
import { useEffect, useState, useRef } from "react";
import LogoImg from "../assets/Logo2.jpeg";

const menuItems = [
  { label: "Home", path: "/" },
  { label: "Products", path: "/products" },
  { label: "Contact", path: "/contact" },
  { label: "Order Lookup", path: "/lookup-order" },
];

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

  const linkRefs = useRef<Record<string, HTMLButtonElement | null>>({});
const [underlineStyle, setUnderlineStyle] = useState({ left: 0, width: 0 });

useEffect(() => {
  const activeEl = linkRefs.current[location.pathname];
  if (activeEl) {
    const rect = activeEl.getBoundingClientRect();
    const parentRect = activeEl.parentElement!.getBoundingClientRect();

    setUnderlineStyle({
      left: rect.left - parentRect.left,
      width: rect.width
    });
  }
}, [location.pathname]);


  return (
    <nav className="w-full bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 py-2 flex items-center justify-between gap-4">
       {/* Logo */}
        <Link to="/" className="flex items-center">
          <img
            src={LogoImg}
            alt="Amineru Foods"
            className="h-12 w-auto object-contain"
          />

        </Link>




        {/* Desktop Links */}

<div className="hidden md:flex items-center gap-8 text-gray-700 font-medium relative">
  {/* Invisible reference container */}
  <div className="absolute bottom-0 left-0 h-[3px] w-full pointer-events-none"></div>

  {/* Animated Underline */}
  <span
    className="absolute bottom-0 h-[3px] bg-[#009632] rounded-full transition-all duration-300 ease-out"
    style={{
      width: underlineStyle.width,
      transform: `translateX(${underlineStyle.left}px)`
    }}
  ></span>

  {/* Links */}
  {menuItems.map((item) => (
    <button
      key={item.path}
      onClick={() => navigate(item.path)}
      ref={(el) => { linkRefs.current[item.path] = el; }}
      className={`relative pb-2 transition ${
        location.pathname === item.path
          ? "text-[#009632]"
          : "hover:text-[#009632]"
      }`}
    >
      {item.label}
    </button>
  ))}
</div>


        {/* Search Bar (hidden on mobile) */}
        <div className="hidden md:flex flex-1 max-w-sm">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search products..."
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#009632]
"
          />
        </div>

        {/* Cart */}
        <Link to="/cart" className="relative cursor-pointer">
          <ShoppingCart className="w-6 h-6 text-gray-700 hover:text-[#009632]
 transition" />
          {totalItems > 0 && (
            <span className="absolute -top-2 -right-2 bg-[#009632]
 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
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
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#009632]
"
          />
          <Link
  to="/"
  className={`${location.pathname === "/" ? "text-[#009632] font-semibold" : ""}`}
  onClick={() => setMobileOpen(false)}
>
  Home
</Link>

<Link
  to="/products"
  className={`${location.pathname === "/products" ? "text-[#009632] font-semibold" : ""}`}
  onClick={() => setMobileOpen(false)}
>
  Products
</Link>

<Link
  to="/lookup-order"
  className={`${location.pathname === "/lookup-order" ? "text-[#009632] font-semibold" : ""}`}
  onClick={() => setMobileOpen(false)}
>
  Order Lookup
</Link>

<Link
  to="/about"
  className={`${location.pathname === "/about" ? "text-[#009632] font-semibold" : ""}`}
  onClick={() => setMobileOpen(false)}
>
  About
</Link>

<Link
  to="/contact"
  className={`${location.pathname === "/contact" ? "text-[#009632] font-semibold" : ""}`}
  onClick={() => setMobileOpen(false)}
>
  Contact
</Link>

        </div>
      )}
    </nav>
  );
}
