import { api } from "@/shared/apiClient";
import { logger } from '../../../shared/logger';

export async function login(body: { email: string; password: string }) {
  logger.debug('Login request', body.email);
  const res = await api.post('/auth/login', body);
  return res.data.data as { _userId: number; token: string; role?: string };
}

export async function register(body: { email: string; password: string; firstName?: string; lastName?: string }) {
  logger.debug('Register request', body.email);
  const res = await api.post('/auth/register', body);
  return res.data.data;
}

export async function logoutApi() {
  logger.debug('Logout request');
  try { await api.post('/auth/logout'); } catch (err) {
    logger.warn('Erreur logout API', err);
  }
  return true;
}
