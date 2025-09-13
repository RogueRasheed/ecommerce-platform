import { create } from "zustand";
import { persist } from "zustand/middleware";

type Product = {
  _id: string;   // MongoDB’s ID
  name: string;
  price: number;
  image: string;
  quantity?: number;
};

type CartState = {
  cart: Product[];
  addToCart: (product: Product) => void; // add entire product object
  removeFromCart: (_id: string) => void; // remove by _id
  clearCart: () => void; // clear entire cart
  increaseQuantity: (_id: string) => void; // increase quantity by 1
  decreaseQuantity: (_id: string) => void; // decrease quantity by 1
};

export const useCart = create<CartState>()(
  persist(
    (set) => ({
      cart: [],

      addToCart: (product) =>
        set((state) => {
          const existing = state.cart.find((item) => item._id === product._id);
          if (existing) {
            return {
              cart: state.cart.map((item) =>
                item._id === product._id
                  ? { ...item, quantity: (item.quantity || 1) + 1 }
                  : item
              ),
            };
          }
          return { cart: [...state.cart, { ...product, quantity: 1 }] };
        }),

      removeFromCart: (_id) =>
        set((state) => ({
          cart: state.cart.filter((item) => item._id !== _id),
        })),

      clearCart: () => set({ cart: [] }),

      increaseQuantity: (_id) =>
        set((state) => ({
          cart: state.cart.map((item) =>
            item._id === _id
              ? { ...item, quantity: (item.quantity || 1) + 1 }
              : item
          ),
        })),

      decreaseQuantity: (_id) =>
        set((state) => ({
          cart: state.cart.map((item) =>
            item._id === _id && (item.quantity || 1) > 1
              ? { ...item, quantity: (item.quantity || 1) - 1 }
              : item
          ),
        })),
    }),
    {
      name: "cart-storage", // 🔑 persisted in localStorage
    }
  )
);
