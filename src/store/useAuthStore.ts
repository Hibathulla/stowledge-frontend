import { create } from "zustand";

interface AuthState {
  user: unknown | null;
  accessToken: string | null;
  setUser: (user: unknown | null) => void;
  setAccessToken: (accessToken: string | null) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  accessToken: null,
  setUser: (user) => set({ user }),
  setAccessToken: (accessToken) => set({ accessToken }),
  logout: () => set({ user: null, accessToken: null }),
}));
