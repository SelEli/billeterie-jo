// src/common/context/AuthContext.jsx
import { createContext, useContext, useState, useEffect } from 'react';
import { getProfile, login as apiLogin, logout as apiLogout } from '../../auth/api/auth';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    if (token) {
      getProfile()
        .then(res => {
          if (isMounted) setUser(res.data);
        })
        .catch(() => {
          setToken(null);
          localStorage.removeItem('token');
        })
        .finally(() => {
          if (isMounted) setLoading(false);
        });
    } else {
      setLoading(false);
    }

    return () => {
      isMounted = false;
    };
  }, [token]);

  const login = async (credentials) => {
    const res = await apiLogin(credentials);
    localStorage.setItem('token', res.data.token);
    setToken(res.data.token);
    setUser(res.data.user || null);
  };

  const logout = async () => {
    await apiLogout();
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  };

  const hasRole = (role) => {
    return user?.role === role;
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, logout, hasRole }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
