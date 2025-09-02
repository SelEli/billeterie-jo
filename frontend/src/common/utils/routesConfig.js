// Pages principales
import Home from '../../pages/Home';

// Auth
import AuthLogin from '../../auth/pages/AuthLogin';
import AuthRegister from '../../auth/pages/AuthRegister';
import AuthProfile from '../../auth/pages/AuthProfile';
import UsersList from '../../auth/pages/UsersList';
import UserDetail from '../../auth/pages/UserDetail';
import RolesList from '../../auth/pages/RolesList';
import RoleDetail from '../../auth/pages/RoleDetail';

// Event (à décommenter quand pages prêtes)
// import EventsList from '../../event/pages/EventsList';
// import EventDetail from '../../event/pages/EventDetail';

// Offer (à décommenter quand pages prêtes)
// import OffersList from '../../offer/pages/OffersList';
// import OfferDetail from '../../offer/pages/OfferDetail';

// Ticketing
import TicketsList from '../../ticketing/pages/TicketsList';
import TicketDetail from '../../ticketing/pages/TicketDetail';

export const routesConfig = [
  // Public
  { path: '/', element: <Home /> },
  { path: '/login', element: <AuthLogin /> },
  { path: '/register', element: <AuthRegister /> },

  // Profil
  { path: '/profile', element: <AuthProfile />, private: true },

  // Utilisateurs
  { path: '/users', element: <UsersList />, private: true, roles: ['ADMIN'] },
  { path: '/users/:id', element: <UserDetail />, private: true, roles: ['ADMIN'] },

  // Rôles
  { path: '/roles', element: <RolesList />, private: true, roles: ['ADMIN'] },
  { path: '/roles/:id', element: <RoleDetail />, private: true, roles: ['ADMIN'] },

  // Events (à décommenter quand pages prêtes)
  // { path: '/events', element: <EventsList />, private: true },
  // { path: '/events/:id', element: <EventDetail />, private: true },

  // Offers (à décommenter quand pages prêtes)
  // { path: '/offers', element: <OffersList />, private: true },
  // { path: '/offers/:id', element: <OfferDetail />, private: true },

  // Tickets
  { path: '/tickets', element: <TicketsList />, private: true },
  { path: '/tickets/:id', element: <TicketDetail />, private: true }
];
