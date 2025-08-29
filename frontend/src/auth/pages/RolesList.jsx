// src/auth/pages/RolesList.jsx
import { useEffect, useState } from 'react';
import PageLayout from '../../common/components/PageLayout';
import List from '../../common/components/List';
import Loader from '../../common/components/Loader';
import { listUsers } from '../api/user';

export default function RolesList() {
  const [users, setUsers] = useState(null);

  useEffect(() => {
    listUsers().then(res => setUsers(res?.data || res));
  }, []);

  if (!users) return <PageLayout title="Gestion des rôles"><Loader /></PageLayout>;

  return (
    <PageLayout title="Gestion des rôles">
      <List data={users} columns={['email', 'role']} linkBase="/roles" />
    </PageLayout>
  );
}
