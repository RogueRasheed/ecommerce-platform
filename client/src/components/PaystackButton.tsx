// src/components/PaystackButton.tsx
import React, { useState } from "react";
import Paystack from "@paystack/inline-js";
import type { PaystackSuccessData, PaystackError } from "@paystack/inline-js";
import toast from "react-hot-toast";

interface PaystackButtonProps {
  // The access code Medusa's Paystack payment session returned
  // (see initiatePaystackSession in lib/medusa.ts). Medusa has already
  // created the transaction on Paystack's side — this button only resumes it.
  accessCode: string;
  onSuccess: (transaction: PaystackSuccessData) => void | Promise<void>;
  onCancel?: () => void;
  onError?: (err: PaystackError | unknown) => void;
  disabled?: boolean;
  className?: string;
  children?: React.ReactNode;
}

const PaystackButton: React.FC<PaystackButtonProps> = ({
  accessCode,
  onSuccess,
  onCancel,
  onError,
  disabled,
  children,
  className,
}) => {
  const [loading, setLoading] = useState(false);

  const payWithPaystack = () => {
    setLoading(true);

    try {
      const popup = new Paystack();

      popup.resumeTransaction(accessCode, {
        onSuccess: async (transaction: PaystackSuccessData) => {
          try {
            await onSuccess(transaction);
          } finally {
            setLoading(false);
          }
        },
        onLoad: () => {
          // Paystack popup is ready — nothing to do.
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
      disabled={disabled || loading}
      className={className ?? "w-full bg-[#009632] text-white py-2 rounded-lg disabled:opacity-60"}
    >
      {loading ? "Processing..." : children ?? "Pay with Paystack"}
    </button>
  );
};

export default PaystackButton;
