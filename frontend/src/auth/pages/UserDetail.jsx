// src/auth/pages/UserDetail.jsx
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../common/context/AuthContext';
import Detail from '../../common/components/Detail';
import UserForm from '../components/UserForm';
import ProfileForm from '../components/ProfileForm';
import { getUser, updateUser, deleteUser } from '../api/user';
import { getProfile, updateProfile, deleteProfile } from '../api/auth';

export default function UserDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, logout, hasRole } = useAuth();

  const isProfile = !id || Number(id) === Number(user?.id);
  const fetchFn = async (paramId) => {
    const res = await (isProfile ? getProfile() : getUser(paramId));
    const data = res?.data || res;
    // ✅ Formatage de la date pour l’input type="date"
    if (data.birthDate) {
      data.birthDate = new Date(data.birthDate).toISOString().split('T')[0];
    }
    return data;
  };

  const FormComponent = isProfile ? ProfileForm : UserForm;

  const handleUpdate = async (values) => {
    let allowed;
    if (isProfile) {
      allowed = (({ firstName, lastName, birthDate }) => ({
        firstName, lastName, birthDate
      }))(values);
      await updateProfile(allowed);
    } else if (hasRole('ADMIN')) {
      allowed = (({
        email, firstName, lastName, birthDate, role, isBlacklisted, blacklistReason
      }) => ({
        email, firstName, lastName, birthDate, role, isBlacklisted, blacklistReason
      }))(values);
      await updateUser(id, allowed);
    } else {
      allowed = (({ firstName, lastName, birthDate }) => ({
        firstName, lastName, birthDate
      }))(values);
      await updateUser(id, allowed);
    }
  };

  const handleDelete = async () => {
    if (isProfile) {
      if (!window.confirm('Supprimer définitivement votre compte ?')) return;
      await deleteProfile();
      await logout();
      navigate('/');
    } else {
      if (!window.confirm('Supprimer cet utilisateur ?')) return;
      await deleteUser(id);
      navigate('/user');
    }
  };

  return (
    <Detail
      id={isProfile ? user.id : id}
      title={isProfile ? 'Mon profil' : `Utilisateur #${id}`}
      fetchFn={() => fetchFn(id)}
      FormComponent={FormComponent}
      onSubmit={handleUpdate}
      onDelete={handleDelete}
      formProps={{ isProfile }}
    />
  );
}
