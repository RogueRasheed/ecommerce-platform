/// <reference types="vite/client" />

// Only variables prefixed with VITE_ are exposed to the browser.
// Keep this list in sync with client/.env.example.
interface ImportMetaEnv {
  readonly VITE_API_BASE_URL: string; // legacy Express API (being retired)
  readonly VITE_MEDUSA_BACKEND_URL: string;
  readonly VITE_MEDUSA_PUBLISHABLE_KEY: string;
  readonly VITE_PAYSTACK_PUBLIC_KEY: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
