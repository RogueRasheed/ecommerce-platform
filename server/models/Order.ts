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
  items: OrderItem[];
  total: number;
  status: "processing" | "successful" | "failed" | "delivered";
  createdAt: Date;
}

const OrderSchema: Schema = new Schema(
  {
    customerName: { type: String, required: true },
    customerEmail: { type: String, required: true },
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
      enum: ["processing", "successful", "failed", "delivered"],
      default: "processing",
    },
  },
  { timestamps: true } // ✅ auto adds createdAt & updatedAt
);

export default mongoose.model<IOrder>("Order", OrderSchema);
