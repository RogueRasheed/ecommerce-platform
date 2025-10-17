import { useState } from "react";
import { useCart } from "../store/useCart";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import Loader from "../components/Loader";

export default function CheckoutPage() {
  const { cart, clearCart, increaseQuantity, decreaseQuantity, removeFromCart } = useCart();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // ✅ Updated keys to match backend (customerPhone, customerAddress)
  const [form, setForm] = useState({
    customerName: "",
    customerEmail: "",
    customerPhone: "",
    city: "",
    customerAddress: "",
    paymentMethod: "",
  });

  const total = cart.reduce(
    (acc, item) => acc + item.price * (item.quantity || 1),
    0
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const items = cart.map((item) => ({
        productId: item._id,
        name: item.name,
        price: item.price,
        qty: item.quantity || 1,
      }));

      // Sends all required fields backend expects
      const response = await fetch("https://ecommerce-platform-jkg6.onrender.com/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerName: form.customerName,
          customerEmail: form.customerEmail,
          customerPhone: form.customerPhone,
          customerAddress: `${form.customerAddress}, ${form.city}`,
          paymentMethod: form.paymentMethod,
          items,
          total,
          status: "processing",
        }),
      });

      if (!response.ok) throw new Error("Failed to place order");

      const order = await response.json();
      toast.success(`✅ Thanks ${form.customerName}, your order has been placed!`);
      clearCart();
      navigate(`/orders/${order._id}/status`);
    } catch (error) {
      console.error(error);
      toast.error("❌ Something went wrong while placing your order.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-6 py-12">
      <h1 className="text-3xl font-bold mb-8">Checkout</h1>

      {cart.length === 0 ? (
        <p className="text-gray-500">Your cart is empty.</p>
      ) : (
        <div className="grid md:grid-cols-2 gap-10">
          {/* Order Summary */}
          <div className="bg-white p-6 rounded-xl shadow">
            <h2 className="text-2xl font-semibold mb-4">Order Summary</h2>
            <div className="divide-y">
              {cart.map((item) => (
                <div key={item._id} className="flex items-center justify-between py-4">
                  <div className="flex items-center gap-4">
                    {item.image && (
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-16 h-16 object-cover rounded-md border"
                      />
                    )}
                    <div>
                      <p className="font-medium">{item.name}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <button
                          onClick={() => decreaseQuantity(item._id)}
                          className="px-2 py-1 border rounded hover:bg-gray-100"
                        >
                          ➖
                        </button>
                        <span className="font-medium">{item.quantity}</span>
                        <button
                          onClick={() => increaseQuantity(item._id)}
                          className="px-2 py-1 border rounded hover:bg-gray-100"
                        >
                          ➕
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="font-semibold">
                      ${(item.price * (item.quantity || 1)).toFixed(2)}
                    </span>
                    <button
                      onClick={() => removeFromCart(item._id)}
                      className="text-red-500 hover:text-red-700 transition text-sm"
                    >
                      ❌
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t mt-4 pt-4 flex justify-between text-lg font-bold">
              <span>Total</span>
              <span>${total.toFixed(2)}</span>
            </div>
          </div>

          {/* Checkout Form */}
          <form onSubmit={handlePlaceOrder} className="bg-white p-6 rounded-xl shadow space-y-4">
            <h2 className="text-2xl font-semibold mb-4">Shipping Details</h2>

            {/* ✅ Updated input names */}
            <input
              type="text"
              name="customerName"
              placeholder="Full Name"
              value={form.customerName}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#009632]"
            />
            <input
              type="email"
              name="customerEmail"
              placeholder="Email Address"
              value={form.customerEmail}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#009632]"
            />
            <input
              type="tel"
              name="customerPhone"
              placeholder="Phone Number"
              value={form.customerPhone}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#009632]"
            />
            <input
              type="text"
              name="city"
              placeholder="City"
              value={form.city}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#009632]"
            />
            <input
              type="text"
              name="customerAddress"
              placeholder="Home Address"
              value={form.customerAddress}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#009632]"
            />

            <select
              name="paymentMethod"
              value={form.paymentMethod}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#009632]"
            >
              <option value="">Select Payment Method</option>
              <option value="card">Paystack</option>
              <option value="paypal">Flutterwave</option>
              <option value="cod">Cash on Delivery</option>
            </select>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#009632] text-white py-2 rounded-lg shadow hover:bg-[#008c2f] disabled:opacity-60"
            >
              {loading ? <Loader message="Processing..." /> : "Place Order"}
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
