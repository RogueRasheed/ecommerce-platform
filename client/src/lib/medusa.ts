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

// Medusa doesn't include total fields (subtotal, shipping_total, total) in a
// cart response by default — they have to be requested explicitly, or they
// silently come back as undefined/0. Every call below that returns a cart
// passes this so mapCart always gets real numbers.
const CART_TOTAL_FIELDS = "+item_subtotal,+shipping_total,+total";

export async function createCart(): Promise<MedusaCartSummary> {
  const region_id = await getRegionId();
  const { cart } = await medusa.store.cart.create(
    { region_id },
    { fields: CART_TOTAL_FIELDS }
  );
  return mapCart(cart);
}

export async function retrieveCart(cartId: string): Promise<MedusaCartSummary> {
  const { cart } = await medusa.store.cart.retrieve(cartId, {
    fields: CART_TOTAL_FIELDS,
  });
  return mapCart(cart);
}

export async function addLineItem(
  cartId: string,
  variantId: string,
  quantity: number
): Promise<MedusaCartSummary> {
  const { cart } = await medusa.store.cart.createLineItem(
    cartId,
    { variant_id: variantId, quantity },
    { fields: CART_TOTAL_FIELDS }
  );
  return mapCart(cart);
}

export async function updateLineItem(
  cartId: string,
  lineItemId: string,
  quantity: number
): Promise<MedusaCartSummary> {
  const { cart } = await medusa.store.cart.updateLineItem(
    cartId,
    lineItemId,
    { quantity },
    { fields: CART_TOTAL_FIELDS }
  );
  return mapCart(cart);
}

export async function deleteLineItem(
  cartId: string,
  lineItemId: string
): Promise<void> {
  await medusa.store.cart.deleteLineItem(cartId, lineItemId);
}

// ---- Checkout: shipping address + email ----

export type ShippingAddressInput = {
  first_name: string;
  last_name: string;
  address_1: string;
  city: string;
  phone?: string;
  country_code: string; // Medusa wants a 2-letter code, e.g. "ng"
};

export async function setCartCheckoutInfo(
  cartId: string,
  email: string,
  address: ShippingAddressInput
): Promise<MedusaCartSummary> {
  const { cart } = await medusa.store.cart.update(
    cartId,
    { email, shipping_address: address },
    { fields: CART_TOTAL_FIELDS }
  );
  return mapCart(cart);
}

// ---- Checkout: shipping method ----

export type ShippingOption = {
  id: string;
  name: string;
  amount: number; // Naira, whole units
};

export async function listShippingOptions(cartId: string): Promise<ShippingOption[]> {
  const { shipping_options } = await medusa.store.fulfillment.listCartOptions({
    cart_id: cartId,
  });
  return (shipping_options as { id: string; name: string; amount?: number; calculated_price?: { calculated_amount: number } }[]).map(
    (o) => ({
      id: o.id,
      name: o.name,
      amount: o.calculated_price?.calculated_amount ?? o.amount ?? 0,
    })
  );
}

export async function addShippingMethod(
  cartId: string,
  optionId: string
): Promise<MedusaCartSummary> {
  const { cart } = await medusa.store.cart.addShippingMethod(
    cartId,
    { option_id: optionId },
    { fields: CART_TOTAL_FIELDS }
  );
  return mapCart(cart);
}

// ---- Checkout: payment ----

// Paystack requires the customer's email in the session data (see plugin docs).
// The plugin puts an access code back in the session's data, which the
// storefront uses to resume the Paystack Inline popup.
//
// The provider_id below has to match exactly what your Medusa backend
// registered it as. Medusa builds this from the plugin's resolve name plus
// its own identifier, so it isn't always the short "pp_paystack" you'd
// expect — check yours via the region's payment providers in DevTools'
// Network tab if this ever stops matching.
const PAYSTACK_PROVIDER_ID = "pp_paystack_paystack";

export async function initiatePaystackSession(
  cart: { id: string },
  email: string
): Promise<{ accessCode: string; authorizationUrl?: string }> {
  const { payment_collection } = await medusa.store.payment.initiatePaymentSession(
    // The SDK only reads `.id` off this, but its type wants a full StoreCart —
    // safe to widen here since we never use the other fields.
    cart as never,
    {
      provider_id: PAYSTACK_PROVIDER_ID,
      data: { email },
    }
  );

  const session = payment_collection.payment_sessions?.find(
    (s: { provider_id: string }) => s.provider_id === PAYSTACK_PROVIDER_ID
  );
  const data = (session?.data ?? {}) as {
    paystackTxAccessCode?: string;
    paystackTxAuthorizationUrl?: string;
  };

  if (!data.paystackTxAccessCode) {
    throw new Error("Paystack did not return an access code. Check that Paystack is enabled on this region.");
  }

  return {
    accessCode: data.paystackTxAccessCode,
    authorizationUrl: data.paystackTxAuthorizationUrl,
  };
}

// ---- Checkout: complete ----

export type CompletedOrder = {
  id: string;
  display_id: number;
};

// Returns the created order on success, or throws with Medusa's error message
// if the cart couldn't be completed (e.g. payment not actually captured yet).
export async function completeCart(cartId: string): Promise<CompletedOrder> {
  const result = await medusa.store.cart.complete(cartId);

  if (result.type === "cart") {
    throw new Error(result.error?.message ?? "Could not complete the order.");
  }

  return { id: result.order.id, display_id: result.order.display_id };
}

export const formatNaira = (amount: number) =>
  new Intl.NumberFormat("en-NG", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);