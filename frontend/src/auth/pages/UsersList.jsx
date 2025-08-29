// src/auth/pages/UsersList.jsx
import { useEffect, useState } from 'react';
import PageLayout from '../../common/components/PageLayout';
import List from '../../common/components/List';
import Loader from '../../common/components/Loader';
import UserForm from '../components/UserForm';
import { listUsers, createUser } from '../api/user';

export default function UsersList() {
  const [users, setUsers] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const refresh = () => listUsers().then(res => setUsers(res?.data || res));

  useEffect(() => {
    refresh();
  }, []);

  if (!users) return <PageLayout title="Utilisateurs"><Loader /></PageLayout>;

  const handleCreate = async (values) => {
    // Filtrage strict selon createUser.schema.js
    const allowed = (({
      email,
      password,
      firstName,
      lastName,
      birthDate,
      role
    }) => ({
      email,
      password,
      firstName,
      lastName,
      birthDate,
      role
    }))(values);

    await createUser(allowed);
    setShowForm(false);
    refresh();
  };

  return (
    <PageLayout title="Utilisateurs">
      <div className="flex justify-end mb-4">
        <button className="btn-jo" onClick={() => setShowForm(v => !v)}>
          {showForm ? 'Fermer' : 'Ajouter un utilisateur'}
        </button>
      </div>

      {showForm && (
        <div className="mb-6">
          <UserForm
            onSubmit={handleCreate}
            submitLabel="Créer"
          />
        </div>
      )}

      <List data={users} columns={['email', 'role']} linkBase="/users" />
    </PageLayout>
  );
}
