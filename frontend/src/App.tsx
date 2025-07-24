// src/App.tsx

import { Routes, Route, Navigate } from 'react-router-dom';
import HomePage from './modules/home/HomePage';
import { LoginPage } from './modules/auth/pages/LoginPage';
import { TicketList } from './modules/ticketing/pages/TicketListPage';
import { TicketCreateForm } from './modules/ticketing/pages/TicketCreateFormPage';
import { Layout } from './shared/Layout';
import { useAuthStore } from './modules/auth/store/useAuthStore';

export default function App(): JSX.Element {
  const { userId } = useAuthStore();

  return (
    <Layout>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="/tickets"
          element={
            userId ? <TicketList /> : <Navigate to="/login" replace />
          }
        />
        <Route
          path="/tickets/new"
          element={
            userId ? <TicketCreateForm /> : <Navigate to="/login" replace />
          }
        />
      </Routes>
    </Layout>
  );
}
