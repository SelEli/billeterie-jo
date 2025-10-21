import { createContext, useContext, useState, useEffect, useRef } from 'react';
import { getProfile, login as apiLogin, logout as apiLogout } from '../../auth/api/auth';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isVisitor, setIsVisitor] = useState(true); // 👈 nouvel état

  const isMountedRef = useRef(true);

  // Chargement initial du profil utilisateur
  useEffect(() => {
    isMountedRef.current = true;

    getProfile()
      .then((res) => {
        if (isMountedRef.current) {
          setUser(res.data);
          setIsVisitor(false); // connecté
          console.info('[AUDIT][AUTH] Profil utilisateur chargé avec succès', { userId: res.data?.id });
        }
      })
      .catch((err) => {
        if (err.message?.includes('401') || err.message?.includes('Unauthorized')) {
          // Cas visiteur non connecté
          console.info('[AUDIT][AUTH] Aucun utilisateur connecté, statut visiteur');
          setUser(null);
          setIsVisitor(true);
        } else {
          console.error('[AUDIT][AUTH] Échec chargement profil', { error: err?.message });
          setUser(null);
          setIsVisitor(true);
        }
      })
      .finally(() => {
        if (isMountedRef.current) setLoading(false);
      });

    return () => {
      isMountedRef.current = false;
    };
  }, []);

  // Connexion
  const login = async (credentials) => {
    try {
      await apiLogin(credentials);
      console.info('[AUDIT][AUTH] Tentative de connexion', { email: credentials?.email });

      const profile = await getProfile();
      setUser(profile.data);
      setIsVisitor(false);

      console.info('[AUDIT][AUTH] Connexion réussie', { userId: profile.data?.id });
    } catch (err) {
      console.error('[AUDIT][AUTH] Échec connexion', { error: err?.message });
      throw err;
    }
  };

  // Déconnexion
  const logout = async () => {
    try {
      await apiLogout();
      setUser(null);
      setIsVisitor(true);
      console.info('[AUDIT][AUTH] Déconnexion réussie');
    } catch (err) {
      console.error('[AUDIT][AUTH] Échec déconnexion', { error: err?.message });
      setUser(null);
      setIsVisitor(true);
    }
  };

  // Vérification rôle
  const hasRole = (role) => {
    return user?.role === role;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token: null, // compatibilité
        loading,
        isVisitor,   // 👈 exposé au reste du front
        login,
        logout,
        hasRole
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
