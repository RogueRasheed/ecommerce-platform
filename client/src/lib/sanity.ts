// client/src/lib/sanity.ts
import { createClient } from "@sanity/client";
import imageUrlBuilder from "@sanity/image-url";

export const sanity = createClient({
  projectId: "v1czm05d",
  dataset: "production",
  apiVersion: "2024-01-01",
  useCdn: true, // fine for the frontend — fast, cached, read-only
});

const builder = imageUrlBuilder(sanity);
export function urlFor(source: any) {
  return builder.image(source);
}

// Shape the frontend already expects, built from a raw Sanity product doc.
export function toProduct(doc: any) {
  return {
    _id: doc._id,
    name: doc.name,
    description: doc.description,
    price: doc.price,
    image: doc.images?.[0] ? urlFor(doc.images[0]).width(600).url() : "",
    category: doc.category,
    stock: doc.stock,
  };
}

export const ALL_PRODUCTS_QUERY = `*[_type == "product"] | order(_createdAt asc){
  _id, name, description, price, category, stock, images
}`;

export const PRODUCT_BY_ID_QUERY = `*[_type == "product" && _id == $id][0]{
  _id, name, description, price, category, stock, images
}`;