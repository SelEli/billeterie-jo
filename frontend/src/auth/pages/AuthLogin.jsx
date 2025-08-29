// src/auth/pages/AuthLogin.jsx
import PageLayout from '../../common/components/PageLayout';
import AuthForm from '../components/AuthForm';
import { useAuth } from '../../common/context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

export default function AuthLogin() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (values) => {
    await login(values);
    navigate('/profile');
  };

  return (
    <PageLayout title="Connexion">
      <div className="max-w-md mx-auto space-y-4">
        <AuthForm mode="login" onSubmit={handleLogin} />
        <p className="text-white drop-shadow text-center">
          Pas de compte ? <Link to="/register" className="underline">Inscrivez-vous</Link>
        </p>
      </div>
    </PageLayout>
  );
}
