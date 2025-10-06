// src/common/context/AuthContext.jsx
import { createContext, useContext, useState, useEffect, useRef } from 'react';
import { getProfile, login as apiLogin, logout as apiLogout } from '../../auth/api/auth';

const AuthContext = createContext();

// Safe, dependency-free JWT payload decoder (base64url)
function decodeJwtPayload(token) {
  if (!token || typeof token !== 'string') return null;
  const parts = token.split('.');
  if (parts.length !== 3) return null;
  try {
    const base64 = parts[1].replace(/-/g, '+').replace(/_/g, '/');
    const padded = base64 + '==='.slice((base64.length + 3) % 4);
    const json = atob(padded);
    return JSON.parse(json);
  } catch {
    return null;
  }
}

function getTokenExpiryMs(token) {
  const payload = decodeJwtPayload(token);
  // exp is seconds since epoch; return ms timestamp or null
  return payload?.exp ? payload.exp * 1000 : null;
}

function isTokenExpired(token) {
  const expMs = getTokenExpiryMs(token);
  if (!expMs) return true; // invalid or missing exp -> treat as expired
  return Date.now() >= expMs;
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(typeof window !== 'undefined' ? localStorage.getItem('token') || null : null);
  const [loading, setLoading] = useState(true);

  // Keep a timeout for scheduled auto-logout
  const logoutTimerRef = useRef(null);
  const isMountedRef = useRef(true);

  // Schedule logout slightly before token expiration
  const scheduleAutoLogout = (currentToken) => {
    // Clear any previous timer
    if (logoutTimerRef.current) {
      clearTimeout(logoutTimerRef.current);
      logoutTimerRef.current = null;
    }

    const expMs = getTokenExpiryMs(currentToken);
    if (!expMs) return; // no schedule if invalid token

    const now = Date.now();
    // Grace period: logout 30s before exp to avoid racing requests
    const fireInMs = Math.max(expMs - now - 30_000, 0);

    logoutTimerRef.current = setTimeout(() => {
      // Defensive: double-check expiration before acting
      if (isTokenExpired(localStorage.getItem('token'))) {
        // Soft logout (no API call) to avoid failing if already expired server-side
        localStorage.removeItem('token');
        setToken(null);
        setUser(null);
      }
    }, fireInMs);
  };

  // Sync logout/login across tabs
  useEffect(() => {
    const onStorage = (e) => {
      if (e.key === 'token') {
        const newToken = e.newValue;
        setToken(newToken);
        if (!newToken) {
          setUser(null);
        } else {
          scheduleAutoLogout(newToken);
        }
      }
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  // Initial load and subsequent token changes
  useEffect(() => {
    isMountedRef.current = true;

    const finish = () => {
      if (isMountedRef.current) setLoading(false);
    };

    if (!token) {
      finish();
    } else if (isTokenExpired(token)) {
      // Expired locally => cleanup
      localStorage.removeItem('token');
      setToken(null);
      setUser(null);
      finish();
    } else {
      // Valid token locally => schedule auto logout and load profile
      scheduleAutoLogout(token);
      getProfile()
        .then((res) => {
          if (isMountedRef.current) setUser(res.data);
        })
        .catch(() => {
          // If backend rejects, clean up locally
          localStorage.removeItem('token');
          setToken(null);
          setUser(null);
        })
        .finally(finish);
    }

    return () => {
      isMountedRef.current = false;
    };
  }, [token]);

  const login = async (credentials) => {
    const res = await apiLogin(credentials);
    const receivedToken = res?.data?.token;

    // Defensive checks: ensure we got a plausible token
    if (!receivedToken || typeof receivedToken !== 'string') {
      // Preserve original behavior: if API changes, avoid breaking UI; just do not store invalid token
      throw new Error('Login failed: invalid token');
    }

    // Optional: reject already-expired tokens
    if (isTokenExpired(receivedToken)) {
      throw new Error('Login failed: token already expired');
    }

    localStorage.setItem('token', receivedToken);
    setToken(receivedToken);
    setUser(res?.data?.user || null);

    scheduleAutoLogout(receivedToken);
  };

  const logout = async () => {
    try {
      await apiLogout();
    } finally {
      // Ensure local cleanup even if API fails
      localStorage.removeItem('token');
      setToken(null);
      setUser(null);
      if (logoutTimerRef.current) {
        clearTimeout(logoutTimerRef.current);
        logoutTimerRef.current = null;
      }
    }
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
