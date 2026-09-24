import { API_BASE_URL } from "../../config";

const BASE_URL = `${API_BASE_URL}/admin`;

export const getDashboardStats = async () => {
  const token = localStorage.getItem("adminToken"); // or wherever you store token
  const res = await fetch(`${BASE_URL}/dashboard/stats`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!res.ok) throw new Error("Failed to fetch dashboard stats");
  return res.json();
};
