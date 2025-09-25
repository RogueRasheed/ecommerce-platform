// src/pages/Contact.tsx
import { Mail, Phone, MapPin } from "lucide-react";

export default function Contact() {
  return (
    <section className="py-20 bg-gradient-to-b from-gray-50 to-white text-gray-900">
      <div className="max-w-6xl mx-auto px-6">
        {/* Title */}
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
          Get in Touch
        </h2>

        {/* Contact Info */}
        <div className="grid md:grid-cols-3 gap-8 mb-16 text-center">
          {[
            { icon: <Mail className="w-6 h-6 text-[#009632] mx-auto mb-3" />, title: "Email", value: "aminerunigent@yahoo.com" },
            { icon: <Phone className="w-6 h-6 text-[#009632] mx-auto mb-3" />, title: "Phone", value: (<><span>+234 08066262972</span><br /><span>+234 08035013890</span></>) },
            { icon: <MapPin className="w-6 h-6 text-[#009632] mx-auto mb-3" />, title: "Address", value: "226, Murtala Mohammed Way, Benin City, Edo State, Nigeria" },
          ].map((item, i) => (
            <div
              key={i}
              className="bg-white shadow-md rounded-2xl p-6 transition hover:shadow-xl hover:scale-105"
            >
              {item.icon}
              <h3 className="font-semibold text-lg mb-1">{item.title}</h3>
              <p className="text-gray-600">{item.value}</p>
            </div>
          ))}
        </div>

        {/* Contact Form */}
        <div className="bg-white shadow-md rounded-2xl p-8 max-w-3xl mx-auto">
          <h3 className="text-2xl font-semibold mb-6 text-center">
            Send us a message
          </h3>
          <form className="grid gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Your Name
              </label>
              <input
                type="text"
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-[#009632] outline-none transition"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Your Email
              </label>
              <input
                type="email"
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-[#009632] outline-none transition"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Your Message
              </label>
              <textarea
                rows={5}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-[#009632] outline-none transition"
              />
            </div>

            <button
              type="submit"
              className="bg-[#009632] hover:bg-[#009632] text-white font-medium py-3 px-6 rounded-lg transition transform hover:scale-105"
            >
              Send Message
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
