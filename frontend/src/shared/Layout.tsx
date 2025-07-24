import { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../modules/auth/store/useAuthStore';
import { ThemeToggle } from './ThemeToggle';

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps): JSX.Element {
  const { userId, logout } = useAuthStore();

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-100">
      {/* Navigation */}
      <nav className="flex justify-between items-center p-4 bg-white dark:bg-gray-800 shadow flex-wrap gap-2">
        <div className="space-x-4">
          <Link to="/" className="underline">Accueil</Link>
          <Link to="/tickets" className="underline">Billets</Link>
          {userId && <Link to="/tickets/new" className="underline">Créer</Link>}
        </div>
        <div className="space-x-4">
          <ThemeToggle />
          {userId ? (
            <>
              <span className="text-sm">👤 {userId}</span>
              <button onClick={logout} className="underline text-red-500">Déconnexion</button>
            </>
          ) : (
            <Link to="/login" className="underline text-blue-600">Connexion</Link>
          )}
        </div>
      </nav>

      <main className="p-6">{children}</main>
    </div>
  );
}
