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

// Events
import EventList from '../../ticketing/pages/EventList';
import EventDetail from '../../ticketing/pages/EventDetail';
import EventCreate from '../../ticketing/pages/EventCreate';
import EventUpdate from '../../ticketing/pages/EventUpdate';

// Offers
import OfferList from '../../ticketing/pages/OfferList';
import OfferDetail from '../../ticketing/pages/OfferDetail';
import OfferCreate from '../../ticketing/pages/OfferCreate';
import OfferUpdate from '../../ticketing/pages/OfferUpdate';

// Ticketing
import TicketsList from '../../ticketing/pages/TicketsList';
import TicketDetail from '../../ticketing/pages/TicketDetail';
import TicketCreate from '../../ticketing/pages/TicketCreate';
import TicketForceValidate from '../../ticketing/pages/TicketForceValidate';

// Stats
import StatsPage from '../../ticketing/pages/StatsPage';

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

  // Users (ADMIN only)
  { path: '/user', element: <UsersList />, private: true, roles: ['ADMIN'] },
  { path: '/user/:id', element: <UserDetail />, private: true, roles: ['ADMIN'] },

  // Roles (ADMIN only)
  { path: '/role', element: <RolesList />, private: true, roles: ['ADMIN'] },
  { path: '/role/:id', element: <RoleDetail />, private: true, roles: ['ADMIN'] },

  // Events
  { path: '/event', element: <EventList /> }, // lecture publique
  { path: '/event/create', element: <EventCreate />, private: true, roles: ['ADMIN'] },
  { path: '/event/:id', element: <EventDetail /> }, // lecture publique
  { path: '/event/:id/edit', element: <EventUpdate />, private: true, roles: ['ADMIN'] },

  // Offers
  { path: '/offer', element: <OfferList /> }, // lecture publique
  { path: '/offer/create', element: <OfferCreate />, private: true, roles: ['ADMIN'] },
  { path: '/offer/:id', element: <OfferDetail /> }, // lecture publique
  { path: '/offer/:id/edit', element: <OfferUpdate />, private: true, roles: ['ADMIN'] },

  // Tickets
  { path: '/ticket', element: <TicketsList />, private: true },
  { path: '/ticket/create', element: <TicketCreate />, private: true },
  { path: '/ticket/:id', element: <TicketDetail />, private: true },
  { path: '/ticket/force-validate', element: <TicketForceValidate />, private: true, roles: ['ADMIN'] },

  // Stats (ADMIN only)
  { path: '/stats', element: <StatsPage />, private: true, roles: ['ADMIN'] },

  // Payment
  { path: '/pay/start', element: <PaymentStart />, private: true },
  { path: '/pay/confirm', element: <PaymentConfirm />, private: true },
  { path: '/pay/failed', element: <PaymentFailed />, private: true },

  // Verification
  { path: '/verification/start', element: <VerificationStart />, private: true },
  { path: '/verification/confirm', element: <VerificationConfirm />, private: true },
  { path: '/verification/failed', element: <VerificationFailed />, private: true }
];
