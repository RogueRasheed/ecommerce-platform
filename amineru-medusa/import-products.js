// import-products-v3.js
// Creates the 8 AMineru Foods products in Medusa (name, price, description).
// Images are skipped here — add them by hand afterward in the admin UI,
// since file uploads from a plain Node script hit an environment quirk
// that isn't worth fighting for just 8 images.

// ---- CONFIG ----
import { MedusaError } from "@medusajs/framework/utils"
const MEDUSA_URL = "http://localhost:9000";
const ADMIN_EMAIL = "rasheedjay13@gmail.com";
const ADMIN_PASSWORD = "kassimiz18";
const CURRENCY_CODE = "ngn";
// ---- END CONFIG ----

const seedProducts = [
  { name: "Unripe Plantain Flour", price: 5000.00, description: "Processed from fresh green unripe plantain fruits, used to prepare that golden brown delicious, nutritious, healthy Amala Swallow." },
  { name: "Beans Flour", price: 5000.00, description: "Processed from white beans for very high protein Akara Balls (Beans Cake), Moimoi (Beans Pudding) and Gbegiri (Beans Soup)." },
  { name: "Groundnut Flour with Spices", price: 4000.00, description: "Processed from Auchi Special groundnut for that very spicy groundnut soup that is excellent for the whole family." },
  { name: "Odorless Fufu Flour", price: 4000.00, description: "Fermented from fresh cassava tubers for low carbohydrate odorless smooth swallow that goes with any soup of your choice." },
  { name: "Yellow Garri", price: 2500.00, description: "Processed from fresh cassava tubers with palm oil, used to make Eba Swallow. Goes well with any soup of your choice." },
  { name: "Soured Garri Soakies", price: 2500.00, description: "A brand of low carbohydrate Garri, processed from fermented cassava tubers, used for that cool, tasty, delicious soak Garri." },
  { name: "Edible Cassava Starch", price: 4000.00, description: "Processed from fresh cassava tubers and used to prepare starch swallow that goes well with banga soup, ogbono/okro soups, etc." },
  { name: "Peppersoup Spices", price: 3500.00, description: "Blended from 10 different Nigerian herbs and spices. Used for making spicy detox peppersoup." },
];

function slugify(name) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

async function login() {
  const res = await fetch(`${MEDUSA_URL}/auth/user/emailpass`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: ADMIN_EMAIL, password: ADMIN_PASSWORD }),
  });
  if (!res.ok) {
    const details = await res.text();
    throw new MedusaError(
      MedusaError.Types.UNEXPECTED_STATE,
      `Login failed (${res.status}): ${details}`,
    );
  }
  const data = await res.json();
  return data.token;
}

async function createProduct(token, p) {
  const res = await fetch(`${MEDUSA_URL}/admin/products`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      title: p.name,
      handle: slugify(p.name),
      description: p.description,
      status: "published",
      options: [{ title: "Default", values: ["Default"] }],
      variants: [
        {
          title: "Default",
          options: { Default: "Default" },
          manage_inventory: false,
          prices: [{ amount: p.price, currency_code: CURRENCY_CODE }],
        },
      ],
    }),
  });
  if (!res.ok) throw new MedusaError(MedusaError.Types.UNEXPECTED_STATE, `${res.status}: ${await res.text()}`);
}

async function run() {
  const token = await login();
  console.log("Logged in to Medusa admin.");

  let created = 0;
  let failed = 0;

  for (const p of seedProducts) {
    try {
      await createProduct(token, p);
      console.log(`  ✅ Created "${p.name}"`);
      created++;
    } catch (err) {
      console.error(`  ❌ Failed "${p.name}":`, err.message);
      failed++;
    }
  }

  console.log(`\nDone. Created: ${created}  Failed: ${failed}`);
  console.log("Now add each product's image by hand in the admin UI.");
}

run().catch((err) => {
  console.error("Import failed:", err.message);
  process.exit(1);
});