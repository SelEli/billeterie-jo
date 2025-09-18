// src/common/components/Header.jsx
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Header() {
  const { user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const [adminMenuOpen, setAdminMenuOpen] = useState(false);

  const toggleMenu = () => setMenuOpen(!menuOpen);
  const closeMenu = () => {
    setMenuOpen(false);
    setAdminMenuOpen(false);
  };
  const toggleAdminMenu = () => setAdminMenuOpen(!adminMenuOpen);

  const isAdmin = user?.role === 'ADMIN';
  const canVerify = ['ADMIN', 'AGENT', 'EMPLOYEE'].includes(user?.role);

  // Liens publics
  const publicLinks = [
    { to: '/', label: 'Accueil' },
    { to: '/sites-plan', label: 'Plan des sites' },
    { to: '/infos-pratiques', label: 'Infos pratiques' },
    { to: '/ticket', label: user ? 'Mes billets' : 'Billetterie' }
  ];

  // Lien Vérification
  const verificationLink = canVerify
    ? { to: '/verification/start', label: 'Vérification' }
    : null;

  // Liens Administration
  const adminLinks = isAdmin
    ? [
        { to: '/user', label: 'Utilisateurs' },
        { to: '/role', label: 'Rôles' }
      ]
    : [];

  // Liens compte
  const guestLinks = [
    { to: '/login', label: 'Connexion' },
    { to: '/register', label: 'S’inscrire' }
  ];
  const userLinks = [
    { to: '/profile', label: 'Mon profil' },
    { action: logout, label: 'Déconnexion', isButton: true }
  ];

  // Fonction pour afficher un lien ou un bouton
  const renderLink = (link) =>
    link.isButton ? (
      <button
        key={link.label}
        onClick={() => {
          link.action();
          closeMenu();
        }}
        className="header-jo__link bg-transparent border-none cursor-pointer text-left"
      >
        {link.label}
      </button>
    ) : (
      <Link
        key={link.label}
        to={link.to}
        className="header-jo__link"
        onClick={closeMenu}
      >
        {link.label}
      </Link>
    );

  return (
    <header className="header-jo shadow-md bg-[rgba(0,38,84,0.95)] text-white">
      <div className="header-jo__inner flex justify-between items-center px-4 py-3 md:px-8">
        
        {/* Logo */}
        <Link to="/" className="header-jo__brand font-bold text-lg" onClick={closeMenu}>
          🏅 JO Paris 2024
        </Link>

        {/* Bouton burger */}
        <button
          className="md:hidden text-2xl focus:outline-none"
          onClick={toggleMenu}
          aria-label="Menu"
        >
          {menuOpen ? '✖' : '☰'}
        </button>

        {/* Navigation */}
        <nav
          className={`${
            menuOpen ? 'flex' : 'hidden'
          } flex-col md:flex md:flex-row md:items-center gap-2 md:gap-6 absolute md:static top-14 left-0 w-full md:w-auto bg-[rgba(0,38,84,0.95)] md:bg-transparent p-4 md:p-0 z-50`}
        >
          {/* Liens publics */}
          {publicLinks.map(renderLink)}

          {/* Vérification */}
          {verificationLink && renderLink(verificationLink)}

          {/* Administration */}
          {isAdmin && (
            <div className="w-full md:w-auto relative">
              <button
                onClick={toggleAdminMenu}
                className="header-jo__link flex justify-between items-center w-full md:w-auto bg-transparent border-none cursor-pointer"
              >
                Administration
                <span className="md:hidden">{adminMenuOpen ? '▲' : '▼'}</span>
              </button>
              <div
                className={`flex flex-col md:absolute md:bg-white md:text-black md:shadow-lg md:rounded-md overflow-hidden transition-all duration-200 ${
                  adminMenuOpen ? 'max-h-40' : 'max-h-0 md:max-h-none md:hidden'
                }`}
              >
                {adminLinks.map((link) => (
                  <Link
                    key={link.label}
                    to={link.to}
                    className="header-jo__link px-4 py-2 hover:bg-gray-200 md:hover:bg-gray-100"
                    onClick={closeMenu}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Liens compte */}
          {user ? userLinks.map(renderLink) : guestLinks.map(renderLink)}
        </nav>
      </div>
    </header>
  );
}
