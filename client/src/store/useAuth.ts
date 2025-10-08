import { create } from "zustand";

type AuthState = {
  user: { name: string; role: "user" | "admin" } | null;
  token: string | null;
  login: (user: AuthState["user"], token: string) => void;
  logout: () => void;
};

export const useAuth = create<AuthState>((set) => ({
  user: null,
  token: null,
  login: (user, token) => set({ user, token }),
  logout: () => set({ user: null, token: null }),
}));
// This store manages authentication state, including user info and JWT token.