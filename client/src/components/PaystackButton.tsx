// src/components/PaystackButton.tsx
import React, { useState } from "react";
import Paystack from "@paystack/inline-js";
import type { PaystackSuccessData, PaystackError } from "@paystack/inline-js";
import { API_BASE_URL } from "../config"; // your config file
import toast from "react-hot-toast";

type PaystackInitResp = {
  reference: string;
  authorization_url?: string;
};

interface PaystackButtonProps {
  orderId: string;              // your backend order id
  amount: number;               // in your currency main units (e.g. 5000 for ₦5,000)
  email: string;
  name?: string;
  phone?: string;
  onSuccess?: (reference: string, transaction: PaystackSuccessData) => void;
  onCancel?: () => void;
  onError?: (err: PaystackError | unknown) => void;
  className?: string;
  children?: React.ReactNode;
}

const PaystackButton: React.FC<PaystackButtonProps> = ({
  orderId,
  amount,
  email,
  name,
  phone,
  onSuccess,
  onCancel,
  onError,
  children,
  className,
}) => {
  const [loading, setLoading] = useState(false);

  const payWithPaystack = async () => {
    setLoading(true);

    try {
      // 1) Ask your backend to INIT the payment — it should create a reference and return it.
      //    Backend should generate a unique reference and save order as pending if not already saved.
      const initRes = await fetch(`${API_BASE_URL}/payments/init`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderId,
          amount,
          email,
          name,
          phone,
        }),
      });

      if (!initRes.ok) {
        const text = await initRes.text();
        throw new Error(`Payment init failed: ${initRes.status} ${text}`);
      }

      const initData = (await initRes.json()) as PaystackInitResp;
      const reference = initData.reference;
      if (!reference) throw new Error("No reference returned from backend.");

      // 2) Open Paystack Inline popup with reference (amount must be in kobo/cents)
      const popup = new Paystack();

      popup.newTransaction({
        key: import.meta.env.VITE_PAYSTACK_PUBLIC_KEY as string,
        email,
        amount: Math.round(amount * 100), // convert to smallest currency unit (kobo/cents)
        reference,
        firstName: name,
        phone,
        metadata: {
          orderId,
        },

        // Called when popup successfully completes payment in browser
        onSuccess: async (transaction: PaystackSuccessData) => {
          try {
            // Let backend verify transaction with Paystack and update order status
            const verifyRes = await fetch(`${API_BASE_URL}/payments/verify`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ reference: transaction.reference, orderId }),
            });

            if (!verifyRes.ok) {
              const txt = await verifyRes.text();
              throw new Error(`Verify failed: ${verifyRes.status} ${txt}`);
            }

            const verifyJson = await verifyRes.json();
            // Backend should respond with final status and saved order data

            toast.success("Payment verified. Thank you!");
            onSuccess?.(transaction.reference, verifyJson);
          } catch (err) {
            console.error("Verification error:", err);
            toast.error("Payment succeeded but verification failed. Check admin panel.");
            onError?.(err);
          } finally {
            setLoading(false);
          }
        },

        onLoad: (resp: Record<string, unknown>) => {
          console.log("Paystack popup loaded:", resp);
        },

        onCancel: () => {
          toast("Payment cancelled.");
          onCancel?.();
          setLoading(false);
        },

        onError: (err: unknown) => {
          console.error("Paystack error:", err);
          toast.error("Payment error. Try again.");
          onError?.(err);
          setLoading(false);
        },
      });
    } catch (err) {
      console.error("PaystackButton error:", err);
      toast.error("Unable to start payment. Try again.");
      onError?.(err);
      setLoading(false);
    }
  };

  return (
    <button
      type="button"
      onClick={payWithPaystack}
      disabled={loading}
      className={className ?? "w-full bg-[#009632] text-white py-2 rounded-lg"}
    >
      {loading ? "Processing..." : children ?? "Pay with Paystack"}
    </button>
  );
};

export default PaystackButton;
