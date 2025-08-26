import axios, { AxiosError } from 'axios';
import type { InternalAxiosRequestConfig } from 'axios';
import { CONFIG } from '../app/config';
import { getToken, getRefreshToken, setSession, triggerUnauthorized } from './session';
import { logger } from './logger';
import { notifications } from './notify';
import { toApiError } from './error';

// --- Création instance Axios ---
export const api = axios.create({
  baseURL: CONFIG.API_BASE_URL,
  withCredentials: false, // JWT en header
  headers: { 'Content-Type': 'application/json' },
});

// --- Intercepteur requêtes: injecter JWT ---
api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = getToken();
  if (token) {
    config.headers = config.headers ?? {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// --- Gestion refresh token ---
let isRefreshing = false;
let queue: { resolve: (v?: unknown) => void; reject: (e: unknown) => void }[] = [];

const processQueue = (error: unknown, token: string | null) => {
  queue.forEach(({ resolve, reject }) => (error ? reject(error) : resolve(token ?? undefined)));
  queue = [];
};

// --- Intercepteur réponses ---
api.interceptors.response.use(
  (res) => res,
  async (error: AxiosError) => {
    const status = error.response?.status;
    const original = error.config as unknown;

    // 401 → tentative de refresh
    if (status === 401 && !original?._retry) {
      const refreshToken = getRefreshToken();

      if (!refreshToken) {
        logger.warn('401 sans refresh token -> logout');
        triggerUnauthorized();
        return Promise.reject(error);
      }

      original._retry = true;

      if (isRefreshing) {
        return new Promise((resolve, reject) => queue.push({ resolve, reject }))
          .then(() => api(original))
          .catch((err) => Promise.reject(err));
      }

      isRefreshing = true;

      try {
        const refreshRes = await axios.post(
          `${CONFIG.API_BASE_URL}/auth/refresh`,
          { refreshToken },
          { withCredentials: false, headers: { 'Content-Type': 'application/json' } }
        );

        const newToken = (refreshRes.data as unknown)?.token;
        if (!newToken) throw new Error('Refresh: token manquant dans la réponse');

        setSession({ token: newToken });
        processQueue(null, newToken);
        return api(original);
      } catch (err) {
        processQueue(err, null);
        triggerUnauthorized();
        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }

    // Autres erreurs → log + toast
    const apiErr = toApiError(error);
    logger.error('Erreur API', apiErr);
    if (!status || status >= 500) {
      notifications.error('Erreur serveur. Réessayez plus tard.');
    } else if (status >= 400) {
      notifications.warn(apiErr.message);
    }
    return Promise.reject(error);
  }
);
