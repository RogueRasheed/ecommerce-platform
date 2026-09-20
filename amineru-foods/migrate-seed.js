// migrate-seed.js
// Pushes the 8 products from server/seedData/products.ts into Sanity,
// reading each product image straight off disk.

import fs from "fs";
import path from "path";
import { createClient } from "@sanity/client";

// ---- CONFIG ----
// Path to your client's public folder, where /images/products lives.
// Adjust this to point at your actual client folder on your machine.
const CLIENT_PUBLIC_DIR = "../client/public";

const sanity = createClient({
  projectId: "v1czm05d",
  dataset: "production",
  apiVersion: "2024-01-01",
  token: "skyF8XviSnHgOgxg0mM8FyB7QsQh0TZEB5B8nQRphvzUWsnnJf7Ka6hTbu95tGu6k8yiqYSmsoiiAMA7JjsG3QpPJcTvbAJFO6g2hpCgGLcxnLduVYxujm8mAksUrfEqny6Z9z38kPi7akYR9gVeRDQvJ22JzHNQDZmjQyOT8iMVvTvZPs1H",
  useCdn: false,
});
// ---- END CONFIG ----

const seedProducts = [
  {
    id: 1,
    name: "Unripe Plantain Flour",
    price: 5000,
    description:
      "Processed from fresh green unripe plantain fruits, used to prepare that golden brown delicious, nutritious, healthy Amala Swallow.",
    image: "/images/products/PlantainFlourF.jpeg",
    category: "Groceries",
  },
  {
    id: 2,
    name: "Beans Flour",
    price: 5000,
    description:
      "Processed from white beans for very high protein Akara Balls (Beans Cake), Moimoi (Beans Pudding) and Gbegiri (Beans Soup).",
    image: "/images/products/BeansF.jpeg",
    category: "Groceries",
  },
  {
    id: 3,
    name: "Groundnut Flour with Spices",
    price: 4000,
    description:
      "Processed from Auchi Special groundnut for that very spicy groundnut soup that is excellent for the whole family.",
    image: "/images/products/GroundnutFlourF.jpeg",
    category: "Groceries",
  },
  {
    id: 4,
    name: "Odorless Fufu Flour",
    price: 4000,
    description:
      "Fermented from fresh cassava tubers for low carbohydrate odorless smooth swallow that goes with any soup of your choice.",
    image: "/images/products/FufuF.jpeg",
    category: "Groceries",
  },
  {
    id: 5,
    name: "Yellow Garri",
    price: 2500,
    description:
      "Processed from fresh cassava tubers with palm oil, used to make Eba Swallow. Goes well with any soup of your choice.",
    image: "/images/products/YellowGarriF.jpeg",
    category: "Groceries",
  },
  {
    id: 6,
    name: "Soured Garri Soakies",
    price: 2500,
    description:
      "A brand of low carbohydrate Garri, processed from fermented cassava tubers, used for that cool, tasty, delicious soak Garri. Combines well with Groundnut, Akara, Moimoi, Sugar, etc.",
    image: "/images/products/SouredgarriF.jpeg",
    category: "Groceries",
  },
  {
    id: 7,
    name: "Edible Cassava Starch",
    price: 4000,
    description:
      "Processed from fresh cassava tubers and used to prepare starch swallow that goes well with banga soup, ogbono/okro soups, etc.",
    image: "/images/products/StarchF.jpeg",
    category: "Groceries",
  },
  {
    id: 8,
    name: "Peppersoup Spices",
    price: 3500,
    description:
      "Blended from 10 different Nigerian herbs and spices. Used for making spicy detox peppersoup.",
    image: "/images/products/PPSoupF.jpg",
    category: "Groceries",
  },
];

function slugify(name) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

async function run() {
  let created = 0;
  let failed = 0;

  for (const p of seedProducts) {
    const images = [];
    const imagePath = path.join(CLIENT_PUBLIC_DIR, p.image);

    if (fs.existsSync(imagePath)) {
      try {
        const buffer = fs.readFileSync(imagePath);
        const asset = await sanity.assets.upload("image", buffer, {
          filename: path.basename(imagePath),
        });
        images.push({
          _type: "image",
          _key: "img-0",
          asset: { _type: "reference", _ref: asset._id },
        });
      } catch (err) {
        console.warn(`  ⚠️  Image upload failed for "${p.name}":`, err.message);
      }
    } else {
      console.warn(`  ⚠️  Image not found on disk: ${imagePath}`);
    }

    const doc = {
      _type: "product",
      name: p.name,
      slug: { _type: "slug", current: slugify(p.name) },
      price: p.price,
      description: p.description,
      category: p.category,
      stock: 40,
      images,
    };

    try {
      await sanity.create(doc);
      console.log(`  ✅ Created "${p.name}"`);
      created++;
    } catch (err) {
      console.error(`  ❌ Failed to create "${p.name}":`, err.message);
      failed++;
    }
  }

  console.log(`\nDone. Created: ${created}  Failed: ${failed}`);
}

run().catch((err) => {
  console.error("Migration failed:", err);
  process.exit(1);
});