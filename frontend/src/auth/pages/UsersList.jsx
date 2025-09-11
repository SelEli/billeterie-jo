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

  const fetchFn = async (params) => {
    // On renvoie la réponse brute pour garder data + meta
    return listUsers(params);
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
        fetchFn={fetchFn}
        render={(users) => (
          <List
            data={users}
            columns={['email', 'role']}
            linkBase="/user"
          />
        )}
      />
    </PageLayout>
  );
}
