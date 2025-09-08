import mongoose, { Schema, Document } from "mongoose";

export interface IProduct extends Document {
  name: string;
  description: string;
  price: number;
  image: string;
  stock: number;   // how many items left
  category?: string;
}

const ProductSchema = new Schema<IProduct>({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  image: { type: String, required: true },
  stock: { type: Number, required: true, default: 0 },
  category: { type: String },
});

export const Product = mongoose.model<IProduct>("Product", ProductSchema);
