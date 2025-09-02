// src/auth/pages/RolesList.jsx
import { useEffect, useState } from 'react';
import PageLayout from '../../common/components/PageLayout';
import List from '../../common/components/List';
import Loader from '../../common/components/Loader';
import { listUsers } from '../api/user';

export default function RolesList() {
  const [roles, setRoles] = useState(null);

  useEffect(() => {
    listUsers()
      .then(res => {
        console.log('Réponse API', res);

        // Récupère le tableau d'utilisateurs quelle que soit la structure
        const allUsers =
          res?.users ||
          res?.data?.users ||
          (Array.isArray(res) ? res : []);

        const safeUsers = Array.isArray(allUsers) ? allUsers : [];

        // Rôles distincts
        const uniqueRoles = Array.from(
          new Set(safeUsers.map(u => u.role).filter(Boolean))
        ).map(roleName => ({
          name: roleName,
          permissions: [] // à remplir si dispo
        }));

        setRoles(uniqueRoles);
      })
      .catch(err => {
        console.error('Erreur API', err);
        setRoles([]); // évite de rester bloqué sur Loader
      });
  }, []);

  if (roles === null) {
    return (
      <PageLayout title="Gestion des rôles">
        <Loader />
      </PageLayout>
    );
  }

  return (
    <PageLayout title="Gestion des rôles">
      {roles.length === 0 ? (
        <p>Aucun rôle trouvé</p>
      ) : (
        <List data={roles} columns={['name', 'permissions']} linkBase="/roles" />
      )}
    </PageLayout>
  );
}
