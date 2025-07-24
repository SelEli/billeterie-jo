import { Routes, Route } from 'react-router-dom';
import { TicketList } from './pages/TicketListPage';
import { TicketDetail } from './pages/TicketDetailPage';
import { TicketCreateForm } from './pages/TicketCreateFormPage';
import { TicketEditForm } from './pages/TicketEditFormPage';
import { PaymentForm } from '../payment/pages/PaymentFormPage';
import { VerifyTicket } from '../verification/pages/VerifyTicketPage';
import { RequireAuth } from '../../shared/RequireAuth';

export function TicketRoutes(): JSX.Element {
  return (
    <Routes>
      {/* Affichage des billets */}
      <Route index element={<TicketList />} />

      {/* Création de billet – nécessite login */}
      <Route
        path="new"
        element={
          <RequireAuth>
            <TicketCreateForm />
          </RequireAuth>
        }
      />

      {/* Détail billet */}
      <Route path=":id" element={<TicketDetail />} />

      {/* Édition de billet – nécessite login */}
      <Route
        path=":id/edit"
        element={
          <RequireAuth>
            <TicketEditForm />
          </RequireAuth>
        }
      />

      {/* Paiement – nécessite login */}
      <Route
        path=":id/pay"
        element={
          <RequireAuth>
            <PaymentForm />
          </RequireAuth>
        }
      />

      {/* Vérification scan – public ou protégé selon rôle */}
      <Route path=":id/verify" element={<VerifyTicket />} />
    </Routes>
  );
}
