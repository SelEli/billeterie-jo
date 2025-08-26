import { Link } from 'react-router-dom';
import { useAuthStore } from '../modules/auth/store/useAuthStore';
import { ThemeToggle } from '../app/ThemeToggle';
import { UserHeader } from '../app/UserHeader';

export function Layout({ children }: { children: React.ReactNode }) {
  const { _userId } = useAuthStore();

  return (
    <div className="min-h-screen flex flex-col">
      <header className="site-header">
        <div className="container py-3 flex justify-between items-center">
          <Link to="/" className="text-2xl font-bold tracking-wide">
            🎟️ Paris 2024
          </Link>
          <nav className="flex items-center gap-4">
            <Link to="/tickets" className="hover:underline">Billets</Link>
            <ThemeToggle />
            <UserHeader />
          </nav>
        </div>
      </header>

      <main className="container flex-1 py-6">
        {children}
      </main>

      <footer className="site-footer">
        © 2025 Paris 2024 Billetterie — Tous droits réservés
      </footer>
    </div>
  );
}
