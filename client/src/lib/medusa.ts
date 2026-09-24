// client/src/lib/medusa.ts
import Medusa from "@medusajs/js-sdk";

export const medusa = new Medusa({
  baseUrl: import.meta.env.VITE_MEDUSA_BACKEND_URL,
  publishableKey: import.meta.env.VITE_MEDUSA_PUBLISHABLE_KEY,
});

// Minimal shapes for the fields we actually read off Medusa's response.
// Medusa's real types are much bigger; we only need these bits.
type MedusaRegion = {
  id: string;
  currency_code: string;
};

type MedusaVariant = {
  id: string;
  calculated_price?: {
    calculated_amount: number;
  };
};

type MedusaProduct = {
  id: string;
  title: string;
  description: string | null;
  thumbnail: string | null;
  images?: { url: string }[];
  variants?: MedusaVariant[];
};

// Medusa needs a region_id (not currency_code) to calculate accurate prices.
// We fetch the NGN region once and cache its id for the rest of the session.
let cachedRegionId: string | undefined;

async function getRegionId(): Promise<string> {
  if (cachedRegionId) return cachedRegionId;

  const { regions } = await medusa.store.region.list();
  const ngnRegion = (regions as MedusaRegion[]).find(
    (r) => r.currency_code === "ngn"
  );

  if (!ngnRegion) {
    throw new Error(
      "No NGN region found in Medusa. Check Settings → Regions in the admin."
    );
  }

  cachedRegionId = ngnRegion.id;
  return ngnRegion.id;
}

// Shape the frontend already expects, built from a raw Medusa product.
export function toProduct(p: MedusaProduct) {
  const variant = p.variants?.[0];
  // Medusa v2 stores prices in whole currency units (₦5,000 is stored as 5000),
  // so the amount can be used as-is. Do NOT divide by 100 here.
  const amount = variant?.calculated_price?.calculated_amount ?? 0;

  return {
    _id: p.id,
    name: p.title,
    description: p.description ?? "",
    price: amount,
    image: p.thumbnail || p.images?.[0]?.url || "",
    variantId: variant?.id, // needed later for adding to cart
  };
}

export async function fetchAllProducts() {
  const region_id = await getRegionId();
  const { products } = await medusa.store.product.list({
    region_id,
    fields: "*variants.calculated_price,*images",
  });
  return (products as MedusaProduct[]).map(toProduct);
}

export async function fetchProductById(id: string) {
  const region_id = await getRegionId();
  const { product } = await medusa.store.product.retrieve(id, {
    region_id,
    fields: "*variants.calculated_price,*images",
  });
  return toProduct(product as MedusaProduct);
}


export type MedusaCartItem = {
  id: string; 
  variantId: string;
  productId: string;
  name: string;
  image: string;
  price: number; // unit price in Naira
  quantity: number;
};

export type MedusaCartSummary = {
  id: string;
  items: MedusaCartItem[];
  subtotal: number;
  shippingTotal: number;
  total: number;
  email?: string;
};

type MedusaCartItemResponse = {
  id: string;
  variant_id: string;
  product_id: string;
  product_title: string;
  thumbnail: string;
  unit_price: number;
  quantity: number;
};

type MedusaCartResponse = {
  id: string;
  email?: string;
  items?: MedusaCartItemResponse[];
  item_subtotal?: number;
  shipping_total?: number;
  total?: number;
};

function mapCart(cart: MedusaCartResponse): MedusaCartSummary {
  return {
    id: cart.id,
    email: cart.email,
    items: (cart.items ?? []).map((item) => ({
      id: item.id,
      variantId: item.variant_id,
      productId: item.product_id,
      name: item.product_title,
      image: item.thumbnail,
      price: item.unit_price,
      quantity: item.quantity,
    })),
    subtotal: cart.item_subtotal ?? 0,
    shippingTotal: cart.shipping_total ?? 0,
    total: cart.total ?? 0,
  };
}

export async function createCart(): Promise<MedusaCartSummary> {
  const region_id = await getRegionId();
  const { cart } = await medusa.store.cart.create({ region_id });
  return mapCart(cart);
}

export async function retrieveCart(cartId: string): Promise<MedusaCartSummary> {
  const { cart } = await medusa.store.cart.retrieve(cartId);
  return mapCart(cart);
}

export async function addLineItem(
  cartId: string,
  variantId: string,
  quantity: number
): Promise<MedusaCartSummary> {
  const { cart } = await medusa.store.cart.createLineItem(cartId, {
    variant_id: variantId,
    quantity,
  });
  return mapCart(cart);
}

export async function updateLineItem(
  cartId: string,
  lineItemId: string,
  quantity: number
): Promise<MedusaCartSummary> {
  const { cart } = await medusa.store.cart.updateLineItem(cartId, lineItemId, {
    quantity,
  });
  return mapCart(cart);
}

export async function deleteLineItem(
  cartId: string,
  lineItemId: string
): Promise<void> {
  await medusa.store.cart.deleteLineItem(cartId, lineItemId);
}