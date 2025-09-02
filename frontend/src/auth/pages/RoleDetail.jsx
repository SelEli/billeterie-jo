// src/auth/pages/RoleDetail.jsx
import PageLayout from '../../common/components/PageLayout';
import Loader from '../../common/components/Loader';
import RoleForm from '../components/RoleForm';
import { getUser } from '../api/user';
import { updateRole } from '../api/role';
import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

export default function RoleDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    getUser(id).then(res => setUser(res?.data || res));
  }, [id]);

  if (!user) {
    return (
      <PageLayout title={`Rôle utilisateur #${id}`}>
        <Loader />
      </PageLayout>
    );
  }

  const handleUpdateRole = async (values) => {
    const allowed = (({ role }) => ({ role }))(values);
    await updateRole(id, allowed.role);
    navigate('/roles');
  };

  return (
    <PageLayout title={`Rôle de ${user.email}`} containerSize="sm" gap="4">
      <RoleForm initialValues={{ role: user.role }} onSubmit={handleUpdateRole} />
      <button className="btn btn--secondary w-full" onClick={() => navigate('/roles')}>
        Retour
      </button>
    </PageLayout>
  );
}
