import { create } from "zustand";
import { persist } from "zustand/middleware";

type Product = {
  id: number;
  name: string;
  price: number;
  image: string;
  quantity?: number;
};

type CartState = {
  cart: Product[];
  addToCart: (product: Product) => void;
  removeFromCart: (id: number) => void;
  clearCart: () => void;
  increaseQuantity: (id: number) => void;
  decreaseQuantity: (id: number) => void;
};

export const useCart = create<CartState>()(
  persist(
    (set) => ({
      cart: [],

      addToCart: (product) =>
        set((state) => {
          const existing = state.cart.find((item) => item.id === product.id);
          if (existing) {
            return {
              cart: state.cart.map((item) =>
                item.id === product.id
                  ? { ...item, quantity: (item.quantity || 1) + 1 }
                  : item
              ),
            };
          }
          return { cart: [...state.cart, { ...product, quantity: 1 }] };
        }),

      removeFromCart: (id) =>
        set((state) => ({
          cart: state.cart.filter((item) => item.id !== id),
        })),

      clearCart: () => set({ cart: [] }),

      increaseQuantity: (id) =>
        set((state) => ({
          cart: state.cart.map((item) =>
            item.id === id
              ? { ...item, quantity: (item.quantity || 1) + 1 }
              : item
          ),
        })),

      decreaseQuantity: (id) =>
        set((state) => ({
          cart: state.cart.map((item) =>
            item.id === id && (item.quantity || 1) > 1
              ? { ...item, quantity: (item.quantity || 1) - 1 }
              : item
          ),
        })),
    }),
    {
      name: "cart-storage", // 🔑 key used in localStorage
    }
  )
);
