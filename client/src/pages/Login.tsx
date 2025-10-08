import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../store/useAuth";

export default function Login() {
  const [username, setUsername] = useState("");
  const [role, setRole] = useState<"user" | "admin">("user");
  const login = useAuth((state) => state.login);
  const navigate = useNavigate();

  function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    const dummyToken = "test-token";
    login({ name: username, role }, dummyToken);
    navigate(role === "admin" ? "/admin" : "/");
  }

  return (
    <div className="flex justify-center items-center h-screen bg-gray-50">
      <form
        onSubmit={handleLogin}
        className="bg-white p-8 rounded-xl shadow-md w-80"
      >
        <h2 className="text-2xl font-bold mb-6 text-center text-[#009632]">
          Login
        </h2>

        <input
          type="text"
          placeholder="Enter your name"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          className="w-full mb-4 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#009632] outline-none"
        />

        <select
          value={role}
          onChange={(e) => setRole(e.target.value as "user" | "admin")}
          className="w-full mb-6 px-3 py-2 border rounded-lg"
        >
          <option value="user">User</option>
          <option value="admin">Admin</option>
        </select>

        <button
          type="submit"
          className="w-full py-2 bg-[#009632] text-white font-semibold rounded-lg hover:bg-[#007a2e] transition"
        >
          Login
        </button>
      </form>
    </div>
  );
}
