import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './common/context/AuthContext';
import PrivateRoute from './common/components/PrivateRoute';
import { routesConfig } from './common/utils/routesConfig.jsx';

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        {routesConfig.map(({ path, element, private: isPrivate, roles }, idx) => {
          const routeElement = isPrivate ? (
            <PrivateRoute roles={roles}>{element}</PrivateRoute>
          ) : (
            element
          );

          return <Route key={idx} path={path} element={routeElement} />;
        })}
      </Routes>
    </AuthProvider>
  );
}
