import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import './index.css';

import { AuthProvider } from './common/context/AuthContext';
import PrivateRoute from './common/components/PrivateRoute';

// Pages (elles gèrent elles-mêmes leur PageLayout)
import Home from './pages/Home';
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
      </Router>
    </AuthProvider>
  );
}
