import { Link } from 'react-router-dom';
import { useAuthStore } from '../modules/auth/store/useAuthStore';

export function UserHeader(): JSX.Element {
  const { userId, role, logout } = useAuthStore();

  return (
    <header className="flex justify-between items-center py-4 px-6 bg-white shadow mb-6">
      <h1 className="text-xl font-bold text-gray-800">🎫 Ticketing App</h1>
      
      <nav className="space-x-4">
        {userId ? (
          <>
            <span className="text-sm text-gray-600">Connecté : <strong>{userId}</strong></span>
            <Link to="/tickets/new" className="text-blue-600 underline">Créer un billet</Link>
            <button onClick={logout} className="text-red-600 underline">Déconnexion</button>
          </>
        ) : (
          <Link to="/login" className="text-blue-600 underline">Connexion</Link>
        )}
      </nav>
    </header>
  );
}
