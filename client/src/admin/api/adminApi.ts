const BASE_URL = "http://localhost:3000/admin"; // change to your backend URL

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
