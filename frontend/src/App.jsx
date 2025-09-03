// src/App.jsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './common/context/AuthContext';
import PrivateRoute from './common/components/PrivateRoute';

// Pages publiques
import Home from './pages/Home';
import SitesPlan from './pages/SitesPlan';
import InfosPratiques from './pages/InfosPratiques';

// Billetterie
import TicketsList from './ticketing/pages/TicketsList';
import TicketDetail from './ticketing/pages/TicketDetail';

// Authentification
import AuthLogin from './auth/pages/AuthLogin';
import AuthRegister from './auth/pages/AuthRegister';
import AuthProfile from './auth/pages/AuthProfile';

// Administration
import UsersList from './auth/pages/UsersList';
import UserDetail from './auth/pages/UserDetail';
import RolesList from './auth/pages/RolesList';
import RoleDetail from './auth/pages/RoleDetail';

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Accueil */}
          <Route path="/" element={<Home />} />

          {/* Pages infos JO */}
          <Route path="/sites-plan" element={<SitesPlan />} />
          <Route path="/infos-pratiques" element={<InfosPratiques />} />

          {/* Billets */}
          <Route path="/ticket" element={<TicketsList />} />
          <Route path="/ticket/:id" element={<TicketDetail />} />

          {/* Authentification */}
          <Route path="/login" element={<AuthLogin />} />
          <Route path="/register" element={<AuthRegister />} />
          <Route
            path="/profile"
            element={
              <PrivateRoute>
                <AuthProfile />
              </PrivateRoute>
            }
          />

          {/* Admin - Utilisateurs & rôles */}
          <Route
            path="/users"
            element={
              <PrivateRoute roles={['ADMIN']}>
                <UsersList />
              </PrivateRoute>
            }
          />
          <Route
            path="/users/:id"
            element={
              <PrivateRoute roles={['ADMIN']}>
                <UserDetail />
              </PrivateRoute>
            }
          />
          <Route
            path="/roles"
            element={
              <PrivateRoute roles={['ADMIN']}>
                <RolesList />
              </PrivateRoute>
            }
          />
          <Route
            path="/roles/:id"
            element={
              <PrivateRoute roles={['ADMIN']}>
                <RoleDetail />
              </PrivateRoute>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}
