import { useState } from "react";
import { useCart } from "../store/useCart";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL, PAYSTACK_PUBLIC_KEY } from "../config";
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

    // Step 1: Place order on backend
    const orderRes = await fetch(`${API_BASE_URL}/orders`, {
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

    if (!orderRes.ok) throw new Error("Failed to place order");
    const order = await orderRes.json();

    // Step 2: If Paystack selected, initialize payment via backend
    if (form.paymentMethod === "paystack") {
      const payRes = await fetch(`${API_BASE_URL}/paystack/init`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: total,
          email: form.customerEmail,
          name: form.customerName,
          phone: form.customerPhone,
          orderId: order._id,
        }),
      });

      if (!payRes.ok) throw new Error("Failed to initialize Paystack payment");
      const payData = await payRes.json();

      // Open Paystack inline payment
      const handler = (window as any).PaystackPop.setup({
        key: PAYSTACK_PUBLIC_KEY,
        email: form.customerEmail,
        amount: total * 100, // in kobo
        ref: payData.reference,
        callback: async function (response: any) {
          try {
            // Step 3: Verify payment on backend
            const verifyRes = await fetch(`${API_BASE_URL}/paystack/verify/${response.reference}`);
            const verifyData = await verifyRes.json();

            if (verifyRes.ok) {
              toast.success(`✅ Payment verified! Ref: ${verifyData.reference}`);
              navigate(`/orders/${verifyData.orderId}/status`);
            } else {
              toast.error("❌ Payment verification failed");
              console.error(verifyData);
            }
          } catch (err) {
            console.error(err);
            toast.error("❌ Error verifying payment");
          }
        },
        onClose: function () {
          toast.error("Payment not completed");
        },
      });

      handler.openIframe();
    } else {
      toast.success(`✅ Order placed!`);
      navigate(`/orders/${order._id}/status`);
    }

    clearCart();
  } catch (err) {
    console.error(err);
    toast.error("❌ Something went wrong.");
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
                          type="button"
                          aria-label="Decrease quantity"
                          onClick={() => decreaseQuantity(item._id)}
                          disabled={(item.quantity || 1) <= 1}
                          className="flex items-center justify-center h-8 w-8 rounded-full border hover:bg-gray-100 transition disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-[#009632]"
                          title="Decrease"
                        >
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-700">
                            <path d="M5 12h14" />
                          </svg>
                        </button>
              
                        <span className="mx-3 font-medium text-lg">{item.quantity}</span>
              
                        <button
                          type="button"
                          aria-label="Increase quantity"
                          onClick={() => increaseQuantity(item._id)}
                          className="flex items-center justify-center h-8 w-8 rounded-full bg-[#009632] text-white hover:bg-[#008c2f] transition focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-[#009632]"
                          title="Increase"
                        >
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white">
                            <path d="M12 5v14" />
                            <path d="M5 12h14" />
                          </svg>
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
              <span>N{total.toFixed(2)}</span>
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
              <option value="paystack">Paystack</option>
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
