import mongoose, { Schema, Document } from "mongoose";

interface OrderItem {
  productId: mongoose.Types.ObjectId; // 🔗 reference Product
  name: string;                       // snapshot of product name
  price: number;                      // snapshot of product price
  qty: number;                        // quantity ordered
}

export interface IOrder extends Document {
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  customerAddress: string;
  items: OrderItem[];
  total: number;
  paymentReference?: string;
  status: "processing" | "successful" | "failed" | "delivered" | "cancelled" | "shipped" | "pending";
  createdAt: Date;
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
    status: {
      type: String,
      enum: ["pending", "processing", "successful", "failed", "delivered", "cancelled", "shipped"],
      default: "processing",
    },
    visibleToUser: { type: Boolean, default: true },
  },
  { timestamps: true } // ✅ auto adds createdAt & updatedAt
);

export default mongoose.model<IOrder>("Order", OrderSchema);
