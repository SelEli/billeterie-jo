import { useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import { login as loginApi, register as registerApi, logoutApi } from '../api/authApi';
import { logger } from '../../../shared/logger';

export function useAuth() {
  const navigate = useNavigate();
  const { setAuth, logout } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<string[] | null>(null);

  const login = useCallback(async (email: string, password: string) => {
    setLoading(true); setErrors(null);
    try {
      const { _userId, token, role } = await loginApi({ email, password });
      setAuth(_userId, token, role ?? null);
      logger.info('Login réussi', { _userId, role });
      navigate('/ticket');
    } catch (err: unknown) {
      const backendErrors = err?.response?.data?.errors;
      setErrors(backendErrors?.length ? backendErrors : ['Une erreur est survenue']);
      logger.error('Erreur login', backendErrors || err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [navigate, setAuth]);

  const register = useCallback(async (email: string, password: string, firstName?: string, lastName?: string) => {
    setLoading(true); setErrors(null);
    try {
      await registerApi({ email, password, firstName, lastName });
      logger.info('Inscription réussie', { email });
      navigate('/login');
    } catch (err: unknown) {
      const backendErrors = err?.response?.data?.errors;
      setErrors(backendErrors?.length ? backendErrors : ['Une erreur est survenue']);
      logger.error('Erreur inscription', backendErrors || err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  const signout = useCallback(async () => {
    try { await logoutApi(); } catch { /* intentionally empty */ }
    logout();
    logger.info('Déconnexion effectuée');
    navigate('/login');
  }, [logout, navigate]);

  return { login, register, signout, loading, errors };
}
