import { Facebook, Instagram, Linkedin, Twitter,  } from "lucide-react";
import logo from "../assets/LogoBlack.jpeg";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-black text-gray-300 py-12">
      <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-3 gap-8">
        {/* Logo & About */}
        <div>
          <img src={logo} alt="Amineru Logo" className="h-32 mb-4" />
          <p className="text-sm">
            Amineru Nigeria Enterprises Ltd is dedicated to providing nutritious,
            affordable agro-based food products with a global reach.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
          <ul className="space-y-2 text-sm">
            <li><Link to="/about" className="hover:text-[#009632]">About Us</Link></li>
            <li><Link to="/products" className="hover:text-[#009632]">Products</Link></li>
            <li><Link to="/contact" className="hover:text-[#009632]">Contact</Link></li>
          </ul>
        </div>

        {/* Socials */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Follow Us</h3>
          <div className="flex gap-8">
            <a href="https://www.facebook.com/aminerufoods" className="hover:text-[#009632]"><Facebook /></a>
            <a href="https://www.instagram.com/aminerufoodss" className="hover:text-[#009632]"><Instagram /></a>
            <a href="https://www.linkedin.com/in/amineru-foods-ab4157245" className="hover:text-[#009632]"><Linkedin /></a>
            <a href="https://www.twitter.com/foodsamineru" className="hover:text-[#009632]"><Twitter /></a>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="mt-8 text-center text-sm text-gray-500">
        © {new Date().getFullYear()} Amineru Nigeria Enterprises Ltd. All rights reserved.
      </div>
    </footer>
  );
}
