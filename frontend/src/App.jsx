import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import './index.css';

import Header from './common/components/Header';
import Footer from './common/components/Footer';
import { AuthProvider } from './common/context/AuthContext';
import PrivateRoute from './common/components/PrivateRoute';

// Pages
import AuthLogin from './auth/pages/AuthLogin';
import AuthRegister from './auth/pages/AuthRegister';
import AuthProfile from './auth/pages/AuthProfile';
import UsersList from './auth/pages/UsersList';
import UserDetail from './auth/pages/UserDetail';
import RolesList from './auth/pages/RolesList';
import RoleDetail from './auth/pages/RoleDetail';

function Home() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center px-4 pt-28 pb-12 gap-6 text-center">
      <h2 className="text-4xl sm:text-5xl font-extrabold text-[var(--bleu-primaire)]">
        Vivez la magie des Jeux
      </h2>
      <p className="max-w-2xl text-white drop-shadow">
        Réservez vos places pour les épreuves olympiques et paralympiques
        dans un cadre exceptionnel.
      </p>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen flex flex-col">
          <Header />
          <Routes>
            <Route path="/" element={<Home />} />
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
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}
