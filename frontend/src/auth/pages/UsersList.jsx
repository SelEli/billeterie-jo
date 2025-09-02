// src/auth/pages/UsersList.jsx
import PageLayout from '../../common/components/PageLayout';
import List from '../../common/components/List';
import UserForm from '../components/UserForm';
import Pagination from '../../common/components/Pagination';
import { listUsers, createUser } from '../api/user';
import { useState } from 'react';

export default function UsersList() {
  const [showForm, setShowForm] = useState(false);

  const handleCreate = async (values) => {
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
  };

  return (
    <PageLayout title="Utilisateurs">
      <div className="actions-bar">
        <button
          className="btn btn--primary"
          onClick={() => setShowForm(v => !v)}
        >
          {showForm ? 'Fermer' : 'Ajouter un utilisateur'}
        </button>
      </div>

      {showForm && (
        <div className="form-container">
          <UserForm
            onSubmit={handleCreate}
            submitLabel="Créer"
            isEdit={false}
          />
        </div>
      )}

      <Pagination
        fetchFn={listUsers}
        render={(users) => (
          <List
            data={users}
            columns={['email', 'role']}
            linkBase="/users"
            // On peut injecter ici des actions si besoin
            // actions={[
            //   { label: 'Modifier', onClick: (id) => navigate(`/users/${id}`), roles: ['ADMIN'] },
            //   { label: 'Supprimer', onClick: deleteUser, danger: true, roles: ['ADMIN'] }
            // ]}
          />
        )}
      />
    </PageLayout>
  );
}
