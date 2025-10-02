import { Facebook, Instagram, } from "lucide-react";
import logo from "../assets/LogoBlack.jpeg";

export default function Footer() {
  return (
    <footer className="bg-black text-gray-300 py-12">
      <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-3 gap-8">
        {/* Logo & About */}
        <div>
          <img src={logo} alt="Amineru Logo" className="h-32 mb-4" />
          <p className="text-sm">
            Amineru Nigeria Enterprises is dedicated to providing nutritious,
            affordable agro-based food products with a global reach.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
          <ul className="space-y-2 text-sm">
            <li><a href="/about" className="hover:text-white">About Us</a></li>
            <li><a href="/products" className="hover:text-white">Products</a></li>
            <li><a href="/contact" className="hover:text-white">Contact</a></li>
          </ul>
        </div>

        {/* Socials */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Follow Us</h3>
          <div className="flex gap-8">
            <a href="#" className="hover:text-[#009632]"><Facebook /></a>
            <a href="#" className="hover:text-[#009632]"><Instagram /></a>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="mt-8 text-center text-sm text-gray-500">
        © {new Date().getFullYear()} Amineru Nigeria Enterprises. All rights reserved.
      </div>
    </footer>
  );
}
