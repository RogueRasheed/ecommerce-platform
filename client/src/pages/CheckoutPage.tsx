import { useState } from "react";
import { useCart } from "../store/useCart";
import { useNavigate } from "react-router-dom";

export default function CheckoutPage() {
  const { cart, clearCart, increaseQuantity, decreaseQuantity, removeFromCart } = useCart();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // 🔑 Track form inputs
  const [form, setForm] = useState({
    customerName: "",
    customerEmail: "",
    phone: "",
    city: "",
    address: "",
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
        productId: item._id, // backend expects productId
        qty: item.quantity || 1,
      }));

      const response = await fetch("https://ecommerce-platform-jkg6.onrender.com/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          customerName: form.customerName,
          customerEmail: form.customerEmail,
          items,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to place order");
      }

      const order = await response.json();

      clearCart();
      navigate(`/order/${order._id}/status`);
    } catch (error) {
      console.error(error);
      alert("❌ Something went wrong while placing your order.");
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

            <input
              type="text"
              name="customerName"
              placeholder="Full Name"
              value={form.customerName}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
            />
            <input
              type="email"
              name="customerEmail"
              placeholder="Email Address"
              value={form.customerEmail}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
            />
            <input
              type="tel"
              name="phone"
              placeholder="Phone Number"
              value={form.phone}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
            />
            <input
              type="text"
              name="city"
              placeholder="City"
              value={form.city}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
            />
            <input
              type="text"
              name="address"
              placeholder="Home Address"
              value={form.address}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
            />

            <select
              name="paymentMethod"
              value={form.paymentMethod}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">Select Payment Method</option>
              <option value="card">Credit/Debit Card</option>
              <option value="paypal">PayPal</option>
              <option value="cod">Cash on Delivery</option>
            </select>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-600 text-white py-2 rounded-lg shadow hover:bg-indigo-700 disabled:opacity-60"
            >
              {loading ? "Processing..." : "Place Order"}
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
