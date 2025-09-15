
const API_BASE_URL =
  import.meta.env.MODE === "development"
    ? "http://localhost:3000/api" // dev server
    : "https://your-api-host.vercel.app/api"; // deployed backend

export default API_BASE_URL;
