import { useState, useEffect } from "react";
import { ChevronDown } from "lucide-react";
import { Link } from "react-router-dom";
import BgImg from "../assets/All Products.jpeg";

export default function Hero() {
  const handleScroll = () => {
    const nextSection = document.getElementById("highlight-section");
    if (nextSection) {
      nextSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  // Facts Array
  const facts = [
    "Plantains are rich in potassium, which supports heart health.",
    "Groundnuts (peanuts) are a great source of protein and healthy fats.",
    "Beans are packed with fiber, which helps digestion and lowers cholesterol.",
    "Plantains are high in vitamin A and C, boosting your immune system.",
    "Groundnuts help improve brain function and reduce inflammation.",
  ];

  const [index, setIndex] = useState(0);

  // Rotate facts every 20 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % facts.length);
    }, 7000);
    return () => clearInterval(interval);
  }, [facts.length]);

  return (
    <section className="relative h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
      {/* Background overlay image */}
      <div className="absolute inset-0">
        <img
          src={BgImg}
          alt="Amineru Products"
          className="w-full h-full object-cover opacity-30"
        />
      </div>

      {/* Hero Content */}
      <div className="relative z-10 max-w-3xl text-center px-6">
        {/* Did You Know Heading */}
        <h1 className="text-5xl md:text-6xl font-extrabold mb-4 leading-tight">
          Did You <span className="text-[#009632]">Know?</span>
        </h1>

        {/* Rotating Fact */}
        <p className="text-lg md:text-xl text-gray-300 italic mb-8 transition-opacity duration-700 ease-in-out">
          “{facts[index]}”
        </p>

        <div className="flex gap-4 justify-center">
          <Link
            to="/products"
            className="px-6 py-3 bg-[#009632] hover:bg-[#009632] text-white rounded-2xl shadow-lg transition-transform transform hover:scale-105"
          >
            Shop Now
          </Link>
          <Link
            to="/about"
            className="px-6 py-3 border border-white/40 hover:bg-white/10 rounded-2xl shadow-lg transition-transform transform hover:scale-105"
          >
            About Us
          </Link>
        </div>
      </div>

      {/* Scroll Down Icon */}
      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 z-10">
        <ChevronDown
          size={40}
          className="text-gray-300 animate-bounce cursor-pointer"
          onClick={handleScroll}
        />
      </div>
    </section>
  );
}
