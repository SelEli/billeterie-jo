// src/common/components/Header.jsx
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Header() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch {
      // no-op
    }
  };

  return (
    <header className="header-jo fixed top-0 w-full z-10">
      <div className="max-w-6xl mx-auto px-4 flex items-center justify-between h-16">
        <Link to="/" className="text-lg sm:text-2xl font-bold">
          🎟 Billetterie Officielle JO 2024
        </Link>

        <nav className="hidden sm:flex gap-6 font-medium">
          <Link to="/" className="hover:text-[var(--or-secondaire)]">Accueil</Link>

          {user?.role === 'ADMIN' && (
            <>
              <Link to="/users" className="hover:text-[var(--or-secondaire)]">Utilisateurs</Link>
              <Link to="/roles" className="hover:text-[var(--or-secondaire)]">Rôles</Link>
            </>
          )}

          {!user && (
            <>
              <Link to="/login" className="hover:text-[var(--or-secondaire)]">Connexion</Link>
              <Link to="/register" className="hover:text-[var(--or-secondaire)]">Inscription</Link>
            </>
          )}

          {user && (
            <>
              <Link to="/profile" className="hover:text-[var(--or-secondaire)]">Mon profil</Link>
              <button onClick={handleLogout} className="hover:text-[var(--or-secondaire)]">Déconnexion</button>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
