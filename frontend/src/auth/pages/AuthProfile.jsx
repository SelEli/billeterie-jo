// src/auth/pages/AuthProfile.jsx
import PageLayout from '../../common/components/PageLayout';
import Loader from '../../common/components/Loader';
import ProfileForm from '../components/ProfileForm';
import { getProfile, updateProfile, deleteProfile } from '../api/auth';
import { useAuth } from '../../common/context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

export default function AuthProfile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const { logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    getProfile()
      .then(res => setProfile(res?.data || res))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Loader />;

  const handleUpdate = async (values) => {
    const allowed = (({ firstName, lastName, birthDate }) => ({
      firstName,
      lastName,
      birthDate
    }))(values);
    await updateProfile(allowed);
  };

  const handleDelete = async () => {
    if (!window.confirm('Supprimer définitivement votre compte ?')) return;
    await deleteProfile();
    await logout();
    navigate('/');
  };

  return (
    <PageLayout title="Mon profil" containerSize="lg" gap="4">
      <ProfileForm initialValues={profile} onSubmit={handleUpdate} />
      <button className="btn btn--danger w-full" onClick={handleDelete}>
        Supprimer mon compte
      </button>
    </PageLayout>
  );
}
