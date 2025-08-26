import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../../modules/auth/store/useAuthStore';

type Props = { children: JSX.Element; role?: string };

export function ProtectedRoute({ children, role }: Props) {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated());
  const hasRole = useAuthStore((s) => s.hasRole);

  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (role && !hasRole(role)) return <Navigate to="/" replace />;
  return children;
}
