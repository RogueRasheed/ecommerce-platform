// All environment-specific values come from client/.env (see .env.example).
// Vite only exposes variables prefixed with VITE_ to the browser, so nothing
// secret should ever be added here.
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL as string;

if (!API_BASE_URL) {
  console.warn("VITE_API_BASE_URL is not set. Copy client/.env.example to client/.env.");
}

export { API_BASE_URL };
