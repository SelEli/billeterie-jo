import { create } from 'zustand';

interface AuthState {
  userId: string | null;
  role: 'user' | 'admin' | null;
  login: (id: string, role?: 'user' | 'admin') => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  userId: null,
  role: null,
  login: (id, role = 'user') => set({ userId: id, role }),
  logout: () => set({ userId: null, role: null }),
}));
