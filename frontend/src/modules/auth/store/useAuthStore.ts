import { create } from 'zustand';
import { logger } from '../../../shared/logger';
import { api } from '../../../shared/apiClient';

interface AuthState {
  _userId: number | null;
  token: string | null;
  role: string | null;

  setAuth: (_userId: number, token: string, role?: string | null) => void;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  hydrate: () => void;

  isAuthenticated: () => boolean;
  hasRole: (role: string) => boolean;
  fetchMe: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  _userId: null,
  token: null,
  role: null,

  setAuth: (_userId, token, role: string | null = null) => {
    try {
      localStorage.setItem('auth_userId', String(_userId));
      localStorage.setItem('auth_token', token);
      if (role !== null) localStorage.setItem('auth_role', role);
      logger.info('Auth set', { _userId, role });
    } catch (err) {
      logger.error('Erreur persistance auth', err);
    }
    set({ _userId, token, role });
  },

  login: async (email, password) => {
    try {
      const res = await api.post('/auth/login', { email, password });
      const { _userId, token, role } = res.data;
      get().setAuth(_userId, token, role || null);
      logger.info('Login réussi', { _userId, role });
    } catch (err) {
      logger.error('Erreur login', err);
      throw err;
    }
  },

  logout: () => {
    try {
      localStorage.removeItem('auth_userId');
      localStorage.removeItem('auth_token');
      localStorage.removeItem('auth_role');
      logger.info('Auth cleared');
    } catch (err) {
      logger.error('Erreur suppression auth', err);
    }
    set({ _userId: null, token: null, role: null });
  },

  hydrate: () => {
    try {
      const storedUserId = localStorage.getItem('auth_userId');
      const storedToken = localStorage.getItem('auth_token');
      const storedRole = localStorage.getItem('auth_role');
      if (storedToken && storedUserId) {
        set({
          _userId: Number(storedUserId),
          token: storedToken,
          role: storedRole || null
        });
        logger.info('Auth hydraté depuis localStorage');
      }
    } catch (err) {
      logger.error('Erreur hydratation auth', err);
    }
  },

  isAuthenticated: () => {
    return !!get().token;
  },

  hasRole: (role: string) => {
    return (get().role ?? '').toLowerCase() === role.toLowerCase();
  },

  fetchMe: async () => {
    try {
      const res = await api.get('/auth/me');
      const { _userId, role } = res.data;
      const token = get().token;
      if (token) {
        get().setAuth(_userId, token, role || null);
      }
      logger.info('Profil récupéré', { _userId, role });
    } catch (err) {
      logger.warn('fetchMe a échoué', err);
    }
  }
}));

// Hydratation immédiate au chargement
useAuthStore.getState().hydrate();
