// src/pages/CheckoutPage.tsx
import React, { useState } from "react";
import { useCart } from "../store/useCart";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../config";
import toast from "react-hot-toast";
import Loader from "../components/Loader";

// Define the shape of the data needed for the form state
interface CheckoutFormState {
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  city: string;
  customerAddress: string;
  paymentMethod: string;
}

// Define the expected structure of the Order response from the backend
interface OrderResponse {
  _id: string;
  // ... other order properties you might receive
}

// Define the expected structure of the Paystack initialization response
interface PaystackInitResponse {
  authorization_url: string;
  reference: string;
}

// Helper for checking if an object is a standard Error
const isError = (e: unknown): e is Error => e instanceof Error;

const CheckoutPage: React.FC = () => {
  const { cart, clearCart } = useCart();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const [form, setForm] = useState<CheckoutFormState>({
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

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
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
          status: "pending", // Orders start as pending for payment
        }),
      });

      if (!orderRes.ok)
        throw new Error(`Failed to place order: ${orderRes.statusText}`);
      const order: OrderResponse = await orderRes.json();

      // Step 2: Initialize Paystack payment via backend
      if (form.paymentMethod === "paystack") {
        const payRes = await fetch(`${API_BASE_URL}/payments/init`, { 
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

        if (!payRes.ok)
          throw new Error(
            `Failed to initialize Paystack payment: ${payRes.statusText}`
          );
        const payData: PaystackInitResponse = await payRes.json();

        // CRITICAL FIX: Redirect to Paystack's URL
        const { authorization_url } = payData;

        if (authorization_url) {
          clearCart(); // Clear cart before redirect
          window.location.href = authorization_url;
          return; // Stop execution here
        } else {
          throw new Error("Paystack authorization URL not received.");
        }
      } else {
        // Logic for COD or other payment methods (No Paystack)
        toast.success(`✅ Order placed!`);
        navigate(`/orders/${order._id}/status`);
        clearCart();
      }
    } catch (err) {
      const errorMessage = isError(err)
        ? err.message
        : "An unknown error occurred during checkout.";
      console.error("Checkout Error:", err);
      toast.error(`❌ Something went wrong: ${errorMessage}`);
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
        // ... (Order Summary and Form JSX) ...
        <div className="grid md:grid-cols-2 gap-10">
          {/* Order Summary */}
          <div className="bg-white p-6 rounded-xl shadow">
            <h2 className="text-2xl font-semibold mb-4">Order Summary</h2>
            <div className="divide-y">
              {cart.map((item) => (
                <div key={item._id} className="flex items-center justify-between py-4">
                  {/* ... cart item display logic ... */}
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

            {/* Input fields are omitted for brevity, but should remain as you had them */}
            {/* ... input fields for customerName, customerEmail, etc. ... */}

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

export default CheckoutPage;