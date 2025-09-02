// src/App.jsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './common/context/AuthContext';
import PrivateRoute from './common/components/PrivateRoute';

// Pages
import Home from './pages/Home';
import TicketsList from './ticketing/pages/TicketsList';
import TicketDetail from './ticketing/pages/TicketDetail';

import AuthLogin from './auth/pages/AuthLogin';
import AuthRegister from './auth/pages/AuthRegister';
import AuthProfile from './auth/pages/AuthProfile';
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

          {/* Billets */}
          <Route path="/tickets" element={<TicketsList />} />
          <Route path="/tickets/:id" element={<TicketDetail />} />

          {/* Authentification */}
          <Route path="/login" element={<AuthLogin />} />
          <Route path="/register" element={<AuthRegister />} />
          <Route path="/profile" element={
            <PrivateRoute>
              <AuthProfile />
            </PrivateRoute>
          } />

          {/* Admin - Utilisateurs & rôles */}
          <Route path="/users" element={
            <PrivateRoute roles={['ADMIN']}>
              <UsersList />
            </PrivateRoute>
          } />
          <Route path="/users/:id" element={
            <PrivateRoute roles={['ADMIN']}>
              <UserDetail />
            </PrivateRoute>
          } />
          <Route path="/roles" element={
            <PrivateRoute roles={['ADMIN']}>
              <RolesList />
            </PrivateRoute>
          } />
          <Route path="/roles/:id" element={
            <PrivateRoute roles={['ADMIN']}>
              <RoleDetail />
            </PrivateRoute>
          } />
        </Routes>
      </Router>
    </AuthProvider>
  );
}
