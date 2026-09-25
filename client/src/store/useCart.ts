import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  createCart,
  addLineItem,
  updateLineItem,
  deleteLineItem,
  type MedusaCartItem,
} from "../lib/medusa";

type Product = {
  _id: string;
  name: string;
  price: number;
  image: string;
  variantId?: string;
};

type CartState = {
  cartId: string | null;
  cart: MedusaCartItem[];
  addToCart: (product: Product) => Promise<void>;
  removeFromCart: (lineItemId: string) => Promise<void>;
  increaseQuantity: (lineItemId: string) => Promise<void>;
  decreaseQuantity: (lineItemId: string) => Promise<void>;
  clearCart: () => Promise<void>;
  resetAfterOrder: () => void;
};

function isStaleReferenceError(err: unknown): boolean {
  const message = err instanceof Error ? err.message : String(err);
  return message.includes("was not found") || message.includes("404");
}

function isTempId(id: string) {
  return id.startsWith("temp-");
}

// Medusa locks a cart while it's being modified, so overlapping requests to
// the same cart (e.g. two quick clicks) fail with a lock error. This queue
// makes all background cart-sync calls run one at a time instead — the
// screen still updates instantly per click, only the network calls serialize.
let syncQueue: Promise<void> = Promise.resolve();
function enqueueSync(task: () => Promise<void>): Promise<void> {
  const run = syncQueue.then(task, task);
  syncQueue = run.catch(() => {}); // one failed task shouldn't block the next
  return run;
}

async function ensureCartId(get: () => CartState, set: (partial: Partial<CartState>) => void) {
  const existing = get().cartId;
  if (existing) return existing;

  const cart = await createCart();
  set({ cartId: cart.id, cart: cart.items });
  return cart.id;
}

async function startFreshCart(set: (partial: Partial<CartState>) => void) {
  const cart = await createCart();
  set({ cartId: cart.id, cart: cart.items });
  return cart.id;
}

export const useCart = create<CartState>()(
  persist(
    (set, get) => ({
      cartId: null,
      cart: [],

      addToCart: async (product) => {
        if (!product.variantId) {
          console.error("Product is missing a variantId — cannot add to cart", product);
          return;
        }
        const variantId = product.variantId; // narrowed to `string`, safe inside the closure below

        // 1. Instant visual feedback, before any network call.
        const displayExisting = get().cart.find((item) => item.variantId === variantId);
        if (displayExisting) {
          set({
            cart: get().cart.map((item) =>
              item.variantId === variantId
                ? { ...item, quantity: item.quantity + 1 }
                : item
            ),
          });
        } else {
          const optimisticItem: MedusaCartItem = {
            id: `temp-${variantId}`,
            variantId: variantId,
            productId: product._id,
            name: product.name,
            image: product.image,
            price: product.price,
            quantity: 1,
          };
          set({ cart: [...get().cart, optimisticItem] });
        }

        // 2. Queued background sync — re-reads current state at execution
        //    time, so it reflects whatever the previous queued action settled on.
        return enqueueSync(async () => {
          try {
            const cartId = await ensureCartId(get, set);
            const serverItem = get().cart.find(
              (item) => item.variantId === variantId && !isTempId(item.id)
            );

            // The optimistic step above already bumped the on-screen quantity,
            // so the local quantity IS the target. Adding +1 here would count
            // the click twice.
            const localQty =
              get().cart.find((item) => item.variantId === variantId)?.quantity ?? 1;

            const updated = serverItem
              ? await updateLineItem(cartId, serverItem.id, serverItem.quantity)
              : await addLineItem(cartId, variantId, localQty);

            set({ cart: updated.items });
          } catch (err) {
            if (isStaleReferenceError(err)) {
              const cartId = await startFreshCart(set);
              const updated = await addLineItem(cartId, variantId, 1);
              set({ cart: updated.items });
              return;
            }
            console.error("Failed to add to cart:", err);
          }
        });
      },

      removeFromCart: async (lineItemId) => {
        const removedItem = get().cart.find((item) => item.id === lineItemId);
        if (!removedItem) return;

        // 1. Remove from screen immediately.
        set({ cart: get().cart.filter((item) => item.id !== lineItemId) });

        // 2. Queued background sync.
        return enqueueSync(async () => {
          const cartId = get().cartId;
          if (!cartId || isTempId(lineItemId)) return; // nothing real to delete yet

          try {
            await deleteLineItem(cartId, lineItemId);
          } catch (err) {
            if (isStaleReferenceError(err)) {
              await startFreshCart(set);
              return;
            }
            console.error("Failed to remove item, restoring:", err);
            set({ cart: [...get().cart, removedItem] });
          }
        });
      },

      increaseQuantity: async (lineItemId) => {
        const item = get().cart.find((i) => i.id === lineItemId);
        if (!item) return;

        set({
          cart: get().cart.map((i) =>
            i.id === lineItemId ? { ...i, quantity: i.quantity + 1 } : i
          ),
        });

        return enqueueSync(async () => {
          const cartId = get().cartId;
          const current = get().cart.find((i) => i.id === lineItemId);
          if (!cartId || !current || isTempId(lineItemId)) return;

          try {
            const updated = await updateLineItem(cartId, lineItemId, current.quantity);
            set({ cart: updated.items });
          } catch (err) {
            if (isStaleReferenceError(err)) {
              await startFreshCart(set);
              return;
            }
            console.error("Failed to update quantity:", err);
          }
        });
      },

      decreaseQuantity: async (lineItemId) => {
        const item = get().cart.find((i) => i.id === lineItemId);
        if (!item || item.quantity <= 1) return;

        set({
          cart: get().cart.map((i) =>
            i.id === lineItemId ? { ...i, quantity: i.quantity - 1 } : i
          ),
        });

        return enqueueSync(async () => {
          const cartId = get().cartId;
          const current = get().cart.find((i) => i.id === lineItemId);
          if (!cartId || !current || isTempId(lineItemId)) return;

          try {
            const updated = await updateLineItem(cartId, lineItemId, current.quantity);
            set({ cart: updated.items });
          } catch (err) {
            if (isStaleReferenceError(err)) {
              await startFreshCart(set);
              return;
            }
            console.error("Failed to update quantity:", err);
          }
        });
      },

      clearCart: async () => {
        const cartId = get().cartId;
        const items = get().cart;

        set({ cart: [] });

        if (!cartId) return;

        return enqueueSync(async () => {
          try {
            for (const item of items) {
              if (!isTempId(item.id)) {
                await deleteLineItem(cartId, item.id);
              }
            }
          } catch {
            // Already gone server-side, or about to be — fine either way.
          }
        });
      },
            resetAfterOrder: () => {
        set({ cart: [], cartId: null });
      },
    }),
    {
      name: "cart-storage", // 🔑 persisted in localStorage — stores cartId + Medusa items
    }
  )
);