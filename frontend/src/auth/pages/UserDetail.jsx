// src/auth/pages/UserDetail.jsx
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import PageLayout from '../../common/components/PageLayout';
import Loader from '../../common/components/Loader';
import UserForm from '../components/UserForm';
import { getUser, updateUser, deleteUser } from '../api/user';

export default function UserDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    getUser(id).then(res => setUser(res?.data || res));
  }, [id]);

  if (!user) return <PageLayout title={`Utilisateur #${id}`}><Loader /></PageLayout>;

  const handleUpdate = async (values) => {
    // Filtrage strict selon updateUser.schema.js (admin)
    const allowed = (({
      email,
      password,
      firstName,
      lastName,
      birthDate,
      role,
      isBlacklisted,
      blacklistReason
    }) => ({
      email,
      password,
      firstName,
      lastName,
      birthDate,
      role,
      isBlacklisted,
      blacklistReason
    }))(values);

    await updateUser(id, allowed);
  };

  const handleDelete = async () => {
    const ok = window.confirm('Supprimer cet utilisateur ?');
    if (!ok) return;
    await deleteUser(id);
    navigate('/users');
  };

  return (
    <PageLayout title={`Utilisateur #${id}`}>
      <div className="max-w-lg mx-auto space-y-4">
        <UserForm
          initialValues={{ ...user, password: '' }}
          onSubmit={handleUpdate}
          submitLabel="Mettre à jour"
        />
        <button className="btn-jo w-full" onClick={handleDelete}>
          Supprimer
        </button>
      </div>
    </PageLayout>
  );
}

