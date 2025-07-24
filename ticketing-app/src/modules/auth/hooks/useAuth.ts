import { useEffect, useState } from 'react';
import { login as apiLogin, getCurrentUser } from '../api/authApi';
import { useAuthStore } from '../store/useAuthStore';

export function useAuth() {
  const { userId, role, login, logout } = useAuthStore();
  const [loading, setLoading] = useState(true);

  // Récupère l'utilisateur connecté au chargement
  useEffect(() => {
    getCurrentUser()
      .then((user) => login(user.id, user.role))
      .catch(() => logout())
      .finally(() => setLoading(false));
  }, [login, logout]);

  // Fonction de login
  const handleLogin = async (username: string, password: string) => {
    const user = await apiLogin(username, password);
    login(user.id, user.role);
  };

  return {
    userId,
    role,
    loading,
    login: handleLogin,
    logout,
  };
}
