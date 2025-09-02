// src/auth/pages/AuthRegister.jsx
import PageLayout from '../../common/components/PageLayout';
import AuthForm from '../components/AuthForm';
import { register as apiRegister } from '../api/auth';
import { useAuth } from '../../common/context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

export default function AuthRegister() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleRegister = async (values) => {
    const allowed = (({ email, password, firstName, lastName, birthDate }) => ({
      email,
      password,
      firstName,
      lastName,
      birthDate
    }))(values);

    await apiRegister(allowed);
    await login({ email: allowed.email, password: allowed.password });
    navigate('/profile');
  };

  return (
    <PageLayout title="Inscription" containerSize="md" gap="4">
      <AuthForm mode="register" onSubmit={handleRegister} />
      <p className="text-white drop-shadow text-center">
        Déjà un compte ? <Link to="/login" className="underline">Connectez-vous</Link>
      </p>
    </PageLayout>
  );
}
