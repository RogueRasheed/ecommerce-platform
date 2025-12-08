import mongoose, { Schema, Document } from "mongoose";

export interface OrderItem {
  productId: mongoose.Types.ObjectId;
  name: string;
  price: number;
  qty: number;
}

export interface IOrder extends Document {
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  customerAddress: string;
  items: OrderItem[];
  total: number;
  paymentMethod?: string; // e.g. 'paystack', 'cod'
  paymentReference?: string; // backend-generated reference (unique)
  transactionId?: string; // Paystack transaction id (from verify)
  paymentStatus?:
    | "pending"
    | "processing"
    | "successful"
    | "failed"
    | "delivered"
    | "cancelled"
    | "shipped";
  paidAt?: Date;
  paymentData?: Record<string, unknown>; // raw Paystack verify response
  metadata?: Record<string, unknown>; // extra information (split, etc.)
  visibleToUser?: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const OrderSchema: Schema = new Schema(
  {
    customerName: { type: String, required: true },
    customerEmail: { type: String, required: true },
    customerPhone: { type: String, required: true },
    customerAddress: { type: String, required: true },

    items: [
      {
        productId: { type: Schema.Types.ObjectId, ref: "Product", required: true },
        name: { type: String, required: true },
        price: { type: Number, required: true },
        qty: { type: Number, required: true },
      },
    ],

    total: { type: Number, required: true },

    paymentMethod: { type: String, enum: ["paystack", "cod", "bank_transfer", "other"], default: "paystack" },

    // Backend-generated Paystack reference (unique)
    paymentReference: { type: String, unique: true, sparse: true },

    // Paystack transaction id (on verification)
    transactionId: { type: String },

    // 'pending' before payment, 'successful' after verify
    paymentStatus: {
      type: String,
      enum: ["pending", "processing", "successful", "failed", "delivered", "cancelled", "shipped"],
      default: "pending",
    },

    paidAt: { type: Date },

    // Store raw Paystack response for auditing
    paymentData: { type: Schema.Types.Mixed },

    metadata: { type: Schema.Types.Mixed },

    visibleToUser: { type: Boolean, default: true },
  },
  { timestamps: true }
);

// Optional index to speed lookups by reference
OrderSchema.index({ paymentReference: 1 });

export default mongoose.model<IOrder>("Order", OrderSchema);
