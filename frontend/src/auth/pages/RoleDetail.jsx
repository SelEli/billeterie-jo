// src/auth/pages/RoleDetail.jsx
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import PageLayout from '../../common/components/PageLayout';
import Loader from '../../common/components/Loader';
import RoleForm from '../components/RoleForm';
import { getUser } from '../api/user';
import { updateRole } from '../api/role';

export default function RoleDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    getUser(id).then(res => setUser(res?.data || res));
  }, [id]);

  if (!user) return <PageLayout title={`Rôle utilisateur #${id}`}><Loader /></PageLayout>;

  const handleUpdateRole = async (values) => {
    // Filtrage strict selon updateRole.schema.js
    const allowed = (({ role }) => ({ role }))(values);
    await updateRole(id, allowed.role);
    navigate('/roles');
  };

  return (
    <PageLayout title={`Rôle de ${user.email}`}>
      <div className="max-w-sm mx-auto space-y-4">
        <RoleForm
          initialValues={{ role: user.role }}
          onSubmit={handleUpdateRole}
        />
        <button className="btn-jo w-full" onClick={() => navigate('/roles')}>
          Retour
        </button>
      </div>
    </PageLayout>
  );
}
