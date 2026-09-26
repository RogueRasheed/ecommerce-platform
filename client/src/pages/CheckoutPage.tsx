// src/pages/CheckoutPage.tsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useCart } from "../store/useCart";
import Loader from "../components/Loader";
import PaystackButton from "../components/PaystackButton";
import type { PaystackSuccessData } from "@paystack/inline-js";
import {
  listShippingOptions,
  addShippingMethod,
  setCartCheckoutInfo,
  initiatePaystackSession,
  completeCart,
  type ShippingOption,
} from "../lib/medusa";

interface AddressFormState {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
}

// This page has two stages:
//   1. "details"  — collect address/email, pick a shipping option
//   2. "payment"   — a Paystack access code is ready; show the Pay button
type Stage = "details" | "payment";

const isError = (e: unknown): e is Error => e instanceof Error;

const CheckoutPage: React.FC = () => {
  const { cart, cartId, resetAfterOrder } = useCart();
  const navigate = useNavigate();

  const [stage, setStage] = useState<Stage>("details");
  const [loading, setLoading] = useState(false);
  const [shippingOptions, setShippingOptions] = useState<ShippingOption[]>([]);
  const [selectedShippingId, setSelectedShippingId] = useState<string>("");
  const [shippingTotal, setShippingTotal] = useState(0);
  const [accessCode, setAccessCode] = useState<string | null>(null);

  const [form, setForm] = useState<AddressFormState>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
  });

  const subtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const total = subtotal + shippingTotal;

  // Load shipping options as soon as there's a cart to check them against.
  useEffect(() => {
    if (!cartId) return;
    listShippingOptions(cartId)
      .then((options) => {
        setShippingOptions(options);
        if (options.length === 1) setSelectedShippingId(options[0].id);
      })
      .catch((err) => {
        console.error("Failed to load shipping options:", err);
        toast.error("Could not load delivery options. Check your connection and try again.");
      });
  }, [cartId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Stage 1 → 2: save address + email on the cart, attach the shipping
  // method, then open a Paystack payment session and grab its access code.
  const handleContinueToPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!cartId) {
      toast.error("Your cart isn't ready yet. Add an item first.");
      return;
    }
    if (!selectedShippingId) {
      toast.error("Choose a delivery option.");
      return;
    }

    setLoading(true);
    try {
      await setCartCheckoutInfo(cartId, form.email, {
        first_name: form.firstName,
        last_name: form.lastName,
        address_1: form.address,
        city: form.city,
        phone: form.phone,
        country_code: "ng",
      });

      const cartWithShipping = await addShippingMethod(cartId, selectedShippingId);
      setShippingTotal(cartWithShipping.shippingTotal);

      const { accessCode } = await initiatePaystackSession({ id: cartId }, form.email);
      setAccessCode(accessCode);
      setStage("payment");
    } catch (err) {
      const message = isError(err) ? err.message : "Something went wrong preparing your order.";
      console.error("Checkout error:", err);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  // Called by PaystackButton once the popup reports success. This is the
  // step that actually creates the Medusa order — the popup alone doesn't.
  const handlePaymentSuccess = async (_transaction: PaystackSuccessData) => {
    if (!cartId) return;
    try {
      const order = await completeCart(cartId);
      // The cart is already completed by Medusa. Do not delete its line items
      // one-by-one after completion; just reset the local persisted cart state.
      resetAfterOrder();
      toast.success("Order placed!");
      navigate(`/orders/${order.id}`);
    } catch (err) {
      const message = isError(err)
        ? err.message
        : "Payment went through, but we couldn't finish placing your order.";
      console.error("Complete cart error:", err);
      toast.error(message);
      // Don't clear the cart here — the payment likely succeeded, and
      // clearing it now would strand the customer with nothing to retry.
    }
  };

  if (cart.length === 0 && stage === "details") {
    return (
      <div className="max-w-5xl mx-auto px-6 py-12">
        <h1 className="text-3xl font-bold mb-8">Checkout</h1>
        <p className="text-gray-500">Your cart is empty.</p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-6 py-12">
      <h1 className="text-3xl font-bold mb-8">Checkout</h1>

      <div className="grid md:grid-cols-2 gap-10">
        {/* Order Summary */}
        <div className="bg-white p-6 rounded-xl shadow">
          <h2 className="text-2xl font-semibold mb-4">Order Summary</h2>
          <div className="divide-y">
            {cart.map((item) => (
              <div key={item.id} className="flex items-center justify-between py-4">
                <div>
                  <p className="font-medium">{item.name}</p>
                  <p className="text-sm text-gray-500">Qty {item.quantity}</p>
                </div>
                <p className="font-semibold">₦{(item.price * item.quantity).toLocaleString()}</p>
              </div>
            ))}
          </div>

          <div className="border-t mt-4 pt-4 space-y-1">
            <div className="flex justify-between text-gray-600">
              <span>Subtotal</span>
              <span>₦{subtotal.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>Shipping</span>
              <span>{shippingTotal > 0 ? `₦${shippingTotal.toLocaleString()}` : "—"}</span>
            </div>
            <div className="flex justify-between text-lg font-bold pt-2">
              <span>Total</span>
              <span>₦{total.toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Stage 1: address + shipping */}
        {stage === "details" && (
          <form onSubmit={handleContinueToPayment} className="bg-white p-6 rounded-xl shadow space-y-4">
            <h2 className="text-2xl font-semibold mb-4">Shipping Details</h2>

            <div className="grid grid-cols-2 gap-3">
              <input name="firstName" placeholder="First name" value={form.firstName} onChange={handleChange} required className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#009632]" />
              <input name="lastName" placeholder="Last name" value={form.lastName} onChange={handleChange} required className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#009632]" />
            </div>
            <input type="email" name="email" placeholder="Email" value={form.email} onChange={handleChange} required className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#009632]" />
            <input name="phone" placeholder="Phone number" value={form.phone} onChange={handleChange} required className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#009632]" />
            <input name="address" placeholder="Delivery address" value={form.address} onChange={handleChange} required className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#009632]" />
            <input name="city" placeholder="City" value={form.city} onChange={handleChange} required className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#009632]" />

            <div>
              <p className="text-sm font-medium text-gray-700 mb-2">Delivery option</p>
              {shippingOptions.length === 0 ? (
                <p className="text-sm text-gray-500">Loading delivery options…</p>
              ) : (
                <div className="space-y-2">
                  {shippingOptions.map((option) => (
                    <label key={option.id} className="flex items-center justify-between border rounded-lg px-4 py-2 cursor-pointer">
                      <span className="flex items-center gap-2">
                        <input
                          type="radio"
                          name="shippingOption"
                          checked={selectedShippingId === option.id}
                          onChange={() => setSelectedShippingId(option.id)}
                        />
                        {option.name}
                      </span>
                      <span className="text-gray-600">₦{option.amount.toLocaleString()}</span>
                    </label>
                  ))}
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={loading || shippingOptions.length === 0}
              className="w-full bg-[#009632] text-white py-2 rounded-lg shadow hover:bg-[#008c2f] disabled:opacity-60"
            >
              {loading ? <Loader message="Preparing your order..." /> : "Continue to payment"}
            </button>
          </form>
        )}

        {/* Stage 2: pay */}
        {stage === "payment" && accessCode && (
          <div className="bg-white p-6 rounded-xl shadow space-y-4">
            <h2 className="text-2xl font-semibold mb-4">Payment</h2>
            <p className="text-gray-600">
              You're paying ₦{total.toLocaleString()} for {cart.length} item{cart.length === 1 ? "" : "s"}.
            </p>
            <PaystackButton accessCode={accessCode} onSuccess={handlePaymentSuccess} />
            <button
              type="button"
              onClick={() => setStage("details")}
              className="w-full text-sm text-gray-500 underline"
            >
              Edit details
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CheckoutPage;
