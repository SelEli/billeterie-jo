// src/common/components/Header.jsx
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Header() {
  const { user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => setMenuOpen(!menuOpen);
  const closeMenu = () => setMenuOpen(false);

  return (
    <header className="header-jo">
      <div className="header-jo__inner">
        {/* Logo / Brand */}
        <Link to="/" className="header-jo__brand" onClick={closeMenu}>
          🏅 JO Paris 2024
        </Link>

        {/* Bouton burger (mobile) */}
        <button
          className="md:hidden text-white focus:outline-none"
          onClick={toggleMenu}
          aria-label="Menu"
        >
          {menuOpen ? '✖' : '☰'}
        </button>

        {/* Navigation */}
        <nav
          className={`${
            menuOpen ? 'flex' : 'hidden'
          } flex-col md:flex md:flex-row md:items-center gap-4 md:gap-6 absolute md:static top-16 left-0 w-full md:w-auto bg-[rgba(0,38,84,0.95)] md:bg-transparent p-4 md:p-0`}
        >
          {/* Liens publics */}
          <Link to="/" className="header-jo__link" onClick={closeMenu}>
            Accueil
          </Link>
          <Link to="/sites-plan" className="header-jo__link" onClick={closeMenu}>
            Plan des sites
          </Link>
          <Link to="/infos-pratiques" className="header-jo__link" onClick={closeMenu}>
            Infos pratiques
          </Link>
          <Link to="/tickets" className="header-jo__link" onClick={closeMenu}>
            Billets
          </Link>

          {/* Liens admin */}
          {user?.role === 'ADMIN' && (
            <>
              <Link to="/users" className="header-jo__link" onClick={closeMenu}>
                Utilisateurs
              </Link>
              <Link to="/roles" className="header-jo__link" onClick={closeMenu}>
                Rôles
              </Link>
            </>
          )}

          {/* Liens auth */}
          {!user && (
            <>
              <Link to="/login" className="header-jo__link" onClick={closeMenu}>
                Connexion
              </Link>
              <Link to="/register" className="header-jo__link" onClick={closeMenu}>
                Inscription
              </Link>
            </>
          )}
          {user && (
            <>
              <Link to="/profile" className="header-jo__link" onClick={closeMenu}>
                Mon profil
              </Link>
              <button
                onClick={() => {
                  logout();
                  closeMenu();
                }}
                className="header-jo__link bg-transparent border-none cursor-pointer text-left"
              >
                Déconnexion
              </button>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
