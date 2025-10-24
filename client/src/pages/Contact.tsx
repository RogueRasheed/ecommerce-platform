// src/pages/Contact.tsx
import { useState } from "react";
import { Mail, Phone, MapPin } from "lucide-react";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSuccessMessage("");
    setErrorMessage("");

    try {
      const res = await fetch("https://ecommerce-platform-jkg6.onrender.com/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error("Failed to send message");

      setSuccessMessage("Message sent successfully!");
      setFormData({ name: "", email: "", message: "" });
    } catch (err) {
      console.error(err);
      setErrorMessage("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

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
            {
              icon: (
                <Mail className="w-6 h-6 text-[#009632] mx-auto mb-3" />
              ),
              title: "Email",
              value: (
                <>
                  <span>aminerunigent@yahoo.com</span> <br />
                  <span>info@aminerufoods.com</span>
                </>
              ),
            },
            {
              icon: (
                <Phone className="w-6 h-6 text-[#009632] mx-auto mb-3" />
              ),
              title: "Phone",
              value: (
                <>
                  <span>+234 08066262972</span>
                  <br />
                  <span>+234 08035013890</span>
                </>
              ),
            },
            {
              icon: (
                <MapPin className="w-6 h-6 text-[#009632] mx-auto mb-3" />
              ),
              title: "Address",
              value: (
                <>
                  <span>
                    226, Murtala Mohammed Way, Imaro House, Benin City, Edo
                    State, Nigeria
                  </span>
                </>
              ),
            },
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

          <form onSubmit={handleSubmit} className="grid gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Your Name
              </label>
              <input
                name="name"
                type="text"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-[#009632] outline-none transition"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Your Email
              </label>
              <input
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-[#009632] outline-none transition"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Your Message
              </label>
              <textarea
                name="message"
                rows={5}
                value={formData.message}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-[#009632] outline-none transition"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-[#009632] hover:bg-[#007a29] text-white font-medium py-3 px-6 rounded-lg transition transform hover:scale-105 disabled:opacity-50"
            >
              {isSubmitting ? "Sending..." : "Send Message"}
            </button>
          </form>

          {successMessage && (
            <p className="text-green-600 text-center mt-4">{successMessage}</p>
          )}
          {errorMessage && (
            <p className="text-red-600 text-center mt-4">{errorMessage}</p>
          )}
        </div>
      </div>
    </section>
  );
}
