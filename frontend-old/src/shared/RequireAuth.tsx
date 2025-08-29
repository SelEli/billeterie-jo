import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../modules/auth/store/useAuthStore';

interface Props {
  children: JSX.Element;
}

export function RequireAuth({ children }: Props): JSX.Element {
  const { _userId } = useAuthStore();
  const location = useLocation();

  if (!_userId) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}
