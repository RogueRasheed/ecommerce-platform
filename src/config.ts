const API_BASE_URL =
  import.meta.env.MODE === "development"
    ? "http://localhost:3000/api" // dev backend
    : "https://ecommerce-platform-jkg6.onrender.com/api"; // render backend

export default API_BASE_URL;
// use /api prefix to match server routes