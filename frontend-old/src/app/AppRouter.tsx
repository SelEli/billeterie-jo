import { Navigate, Route, Routes } from 'react-router-dom';
import { LoginPage } from '../modules/auth/pages/LoginPage';
import { RegisterPage } from '../modules/auth/pages/RegisterPage';
import { useAuthStore } from '../modules/auth/store/useAuthStore';

export default function AppRouter() {
  const { _userId } = useAuthStore();

  return (
    <Routes>
      {/* Auth */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* Ici tu peux ajouter d'autres routes protégées plus tard */}

      {/* Redirection par défaut */}
      <Route path="*" element={<Navigate to={_userId ? '/' : '/login'} replace />} />
    </Routes>
  );
}
