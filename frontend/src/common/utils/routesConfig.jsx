// src/common/utils/routesConfig.jsx

// Pages principales
import Home from '../../pages/Home';
import SitesPlan from '../../pages/SitesPlan';
import InfosPratiques from '../../pages/InfosPratiques';

// Auth
import AuthLogin from '../../auth/pages/AuthLogin';
import AuthRegister from '../../auth/pages/AuthRegister';
import AuthProfile from '../../auth/pages/AuthProfile';

// Users
import UsersList from '../../auth/pages/UsersList';
import UserDetail from '../../auth/pages/UserDetail';

// Roles
import RolesList from '../../auth/pages/RolesList';
import RoleDetail from '../../auth/pages/RoleDetail';

// Event (à décommenter quand pages prêtes)
// import EventsList from '../../event/pages/EventsList';
// import EventDetail from '../../event/pages/EventDetail';

// Offer (à décommenter quand pages prêtes)
// import OffersList from '../../offer/pages/OffersList';
// import OfferDetail from '../../offer/pages/OfferDetail';

// Ticketing
import TicketsList from '../../ticketing/pages/TicketsList'; // seul au pluriel
import TicketDetail from '../../ticketing/pages/TicketDetail';
import TicketCreate from '../../ticketing/pages/TicketCreate';
import TicketForceValidate from '../../ticketing/pages/TicketForceValidate';

// Payment
import PaymentStart from '../../payment/pages/PaymentStart';
import PaymentConfirm from '../../payment/pages/PaymentConfirm';
import PaymentFailed from '../../payment/pages/PaymentFailed';

// Verification
import VerificationStart from '../../verification/pages/VerificationStart';
import VerificationConfirm from '../../verification/pages/VerificationConfirm';
import VerificationFailed from '../../verification/pages/VerificationFailed';

export const routesConfig = [
  // Public
  { path: '/', element: <Home /> },
  { path: '/sites-plan', element: <SitesPlan /> },
  { path: '/infos-pratiques', element: <InfosPratiques /> },
  { path: '/login', element: <AuthLogin /> },
  { path: '/register', element: <AuthRegister /> },

  // Profil
  { path: '/profile', element: <AuthProfile />, private: true },

  // Users
  { path: '/user', element: <UsersList />, private: true, roles: ['ADMIN'] },
  { path: '/user/:id', element: <UserDetail />, private: true, roles: ['ADMIN'] },

  // Roles
  { path: '/role', element: <RolesList />, private: true, roles: ['ADMIN'] },
  { path: '/role/:id', element: <RoleDetail />, private: true, roles: ['ADMIN'] },

  // Events (à décommenter quand pages prêtes)
  // { path: '/events', element: <EventsList />, private: true },
  // { path: '/event/:id', element: <EventDetail />, private: true },

  // Offers (à décommenter quand pages prêtes)
  // { path: '/offers', element: <OffersList />, private: true },
  // { path: '/offer/:id', element: <OfferDetail />, private: true },

  // Tickets
  { path: '/ticket', element: <TicketsList />, private: true },
  { path: '/ticket/create', element: <TicketCreate />, private: true },
  { path: '/ticket/:id', element: <TicketDetail />, private: true },
  { path: '/ticket/force-validate', element: <TicketForceValidate />, private: true, roles: ['ADMIN'] },

  // Payment
  { path: '/pay/start', element: <PaymentStart />, private: true },
  { path: '/pay/confirm', element: <PaymentConfirm />, private: true },
  { path: '/pay/failed', element: <PaymentFailed />, private: true },


  // Verification
  { path: '/verification/start', element: <VerificationStart />, private: true },
  { path: '/verification/confirm', element: <VerificationConfirm />, private: true },
  { path: '/verification/failed', element: <VerificationFailed />, private: true }
];
