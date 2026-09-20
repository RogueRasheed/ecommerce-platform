// server/sanityClient.ts
// Server-side Sanity client. Uses a token with Editor rights so it can
// decrement stock after a successful order. This token must NEVER be
// exposed to the frontend — keep it only in the server's .env file.

import { createClient } from "@sanity/client";

export const sanity = createClient({
  projectId: process.env.SANITY_PROJECT_ID || "v1czm05d",
  dataset: process.env.SANITY_DATASET || "production",
  apiVersion: "2024-01-01",
  token: process.env.SANITY_TOKEN, // write token, server-only
  useCdn: false, // must be false to get fresh stock counts, not cached ones
});