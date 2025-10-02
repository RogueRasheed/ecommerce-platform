/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL?: string; // 👈 your custom variable
  // add more custom VITE_ vars if needed
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
// Note: only variables prefixed with VITE_ are exposed to the client

