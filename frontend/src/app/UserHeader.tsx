import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../modules/auth/store/useAuthStore';

export function UserHeader() {
  const { _userId, logout } = useAuthStore();
  const navigate = useNavigate();

  if (!_userId) {
    return <Link to="/login" className="btn btn-secondary">Connexion</Link>;
  }

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="flex items-center gap-3">
      <span className="text-sm opacity-80">ID: {_userId}</span>
      <button className="btn btn-secondary" onClick={handleLogout}>Déconnexion</button>
    </div>
  );
}
