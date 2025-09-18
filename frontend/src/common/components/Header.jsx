// src/common/components/Header.jsx
import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Header() {
  const { user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const [eventMenuOpen, setEventMenuOpen] = useState(false);
  const [adminMenuOpen, setAdminMenuOpen] = useState(false);
  const [accountMenuOpen, setAccountMenuOpen] = useState(false);

  const headerRef = useRef(null);

  const toggleMenu = () => setMenuOpen(!menuOpen);
  const closeMenu = () => {
    setMenuOpen(false);
    setEventMenuOpen(false);
    setAdminMenuOpen(false);
    setAccountMenuOpen(false);
  };

  const toggleEventMenu = () => setEventMenuOpen(!eventMenuOpen);
  const toggleAdminMenu = () => setAdminMenuOpen(!adminMenuOpen);
  const toggleAccountMenu = () => setAccountMenuOpen(!accountMenuOpen);

  const isAdmin = user?.role === 'ADMIN';
  const canVerify = ['ADMIN', 'AGENT', 'EMPLOYEE'].includes(user?.role);

  const verificationLink = canVerify
    ? { to: '/verification/start', label: 'Vérification' }
    : null;

  const adminLinks = isAdmin
    ? [
        { to: '/user', label: 'Utilisateurs' },
        { to: '/role', label: 'Rôles' }
      ]
    : [];

  const accountLinks = [
    { to: '/profile', label: 'Mon profil' },
    { action: logout, label: 'Déconnexion', isButton: true }
  ];

  const renderLink = (link) => {
    const baseClasses = 'header-jo__link';
    const ticketClasses = 'btn btn--nav-ticket text-black';
    const outlined = 'btn btn--nav-outlined no-border';

    const extraClasses =
      link.to === '/ticket'
        ? ticketClasses
        : link.to === '/verification/start'
        ? outlined
        : '';

    return link.isButton ? (
      <button
        key={link.label}
        onClick={() => {
          link.action();
          closeMenu();
        }}
        className={`${baseClasses} ${extraClasses}`}
      >
        {link.label}
      </button>
    ) : (
      <Link
        key={link.label}
        to={link.to}
        className={`${baseClasses} ${extraClasses}`}
        onClick={closeMenu}
      >
        {link.label}
      </Link>
    );
  };

  // 🔹 Fermer les sous-menus si clic à l'extérieur
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (headerRef.current && !headerRef.current.contains(e.target)) {
        setEventMenuOpen(false);
        setAdminMenuOpen(false);
        setAccountMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="header-jo" ref={headerRef}>
      <div className="header-jo__inner">
        {/* Logo */}
        <Link to="/" className="header-jo__brand" onClick={closeMenu}>
          🏅 JO Paris 2024
        </Link>

        {/* Burger */}
        <button
          className="header-jo__burger"
          onClick={toggleMenu}
          aria-label="Menu"
        >
          {menuOpen ? '✖' : '☰'}
        </button>

        {/* Navigation */}
        <nav className={`header-jo__nav ${menuOpen ? 'open' : ''}`}>
          {renderLink({ to: '/', label: 'Accueil' })}

          {/* Événements */}
          <div className="header-jo__dropdown">
            <button
              onClick={toggleEventMenu}
              className="header-jo__dropdown-toggle btn btn--nav-outlined no-border"
            >
              Événements
              <span>{eventMenuOpen ? '▲' : '▼'}</span>
            </button>
            <div
              className={`header-jo__dropdown-menu wide ${
                eventMenuOpen ? 'open' : ''
              }`}
            >
              {renderLink({ to: '/sites-plan', label: 'Plan des sites' })}
              {renderLink({ to: '/infos-pratiques', label: 'Infos pratiques' })}
            </div>
          </div>

          {/* Billetterie */}
          {renderLink({
            to: '/ticket',
            label: user ? 'Mes billets' : 'Billetterie'
          })}

          {/* Vérification */}
          {verificationLink && renderLink(verificationLink)}

          {/* Administration */}
          {isAdmin && (
            <div className="header-jo__dropdown">
              <button
                onClick={toggleAdminMenu}
                className="header-jo__dropdown-toggle btn btn--nav-outlined no-border"
              >
                Administration
                <span>{adminMenuOpen ? '▲' : '▼'}</span>
              </button>
              <div
                className={`header-jo__dropdown-menu wide ${
                  adminMenuOpen ? 'open' : ''
                }`}
              >
                {adminLinks.map((link) => (
                  <Link
                    key={link.label}
                    to={link.to}
                    className="header-jo__link"
                    onClick={closeMenu}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Mon compte */}
          {user && (
            <div className="header-jo__dropdown">
              <button
                onClick={toggleAccountMenu}
                className="header-jo__dropdown-toggle btn btn--nav-outlined no-border"
              >
                {/* Icône SVG inline */}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="1.2em"
                  height="1.2em"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  style={{ marginRight: '0.5rem' }}
                >
                  <path d="M12 12c2.7 0 5-2.3 5-5s-2.3-5-5-5-5 2.3-5 5 2.3 5 5 5zm0 2c-3.3 0-10 1.7-10 5v3h20v-3c0-3.3-6.7-5-10-5z" />
                </svg>
                Mon compte
                <span>{accountMenuOpen ? '▲' : '▼'}</span>
              </button>
              <div
                className={`header-jo__dropdown-menu wide ${
                  accountMenuOpen ? 'open' : ''
                }`}
              >
                {accountLinks.map(renderLink)}
              </div>
            </div>
          )}

          {/* Compte invité */}
          {!user && (
            <>
              {renderLink({ to: '/login', label: 'Connexion' })}
              {renderLink({ to: '/register', label: 'S’inscrire' })}
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
