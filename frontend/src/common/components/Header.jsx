// src/common/components/Header.jsx
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Header() {
  const { user, logout } = useAuth();

  return (
    <header className="header-jo">
      <div className="header-jo__inner">
        <Link to="/" className="header-jo__brand">
          🏅 JO Paris 2024
        </Link>
        <nav className="header-jo__nav">
          <Link to="/" className="header-jo__link">Accueil</Link>
          {user?.role === 'ADMIN' && (
            <>
              <Link to="/users" className="header-jo__link">Utilisateurs</Link>
              <Link to="/roles" className="header-jo__link">Rôles</Link>
            </>
          )}
          {!user && (
            <>
              <Link to="/login" className="header-jo__link">Connexion</Link>
              <Link to="/register" className="header-jo__link">Inscription</Link>
            </>
          )}
          {user && (
            <>
              <Link to="/profile" className="header-jo__link">Mon profil</Link>
              <button onClick={logout} className="header-jo__link">Déconnexion</button>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
