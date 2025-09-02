// src/ticketing/pages/TicketsList.jsx
import { useState } from 'react';
import PageLayout from '../../common/components/PageLayout';
import List from '../../common/components/List';
import Pagination from '../../common/components/Pagination';
import TicketForm from '../components/TicketForm';
import { listTickets, createTicket } from '../api/ticket';
import { useAuth } from '../../common/context/AuthContext';

export default function TicketsList() {
  const [showForm, setShowForm] = useState(false);
  const { user, hasRole } = useAuth();

  const handleCreate = async (values) => {
    // On envoie toutes les valeurs nécessaires
    const allowed = (({ price, zone, status, eventId, offerId }) => ({
      price,
      zone,
      status,
      eventId,
      offerId
    }))(values);

    await createTicket(allowed);
    setShowForm(false);
  };

  // Fonction de fetch adaptée au rôle
  const fetchFn = (params) => {
    if (hasRole('ADMIN')) {
      // Admin → tous les tickets
      return listTickets(params);
    }
    // Utilisateur → seulement ses tickets
    return listTickets({ ...params, userId: user.id });
  };

  return (
    <PageLayout title="Tickets">
      <div className="actions-bar">
        <button
          className="btn btn--primary"
          onClick={() => setShowForm(v => !v)}
        >
          {showForm ? 'Fermer' : 'Créer un ticket'}
        </button>
      </div>

      {showForm && (
        <div className="form-container">
          <TicketForm
            onSubmit={handleCreate}
            submitLabel="Créer"
            isEdit={false}
            createdById={user.id}
          />
        </div>
      )}

      <Pagination
        fetchFn={fetchFn}
        render={(tickets) => (
          <List
            data={tickets}
            columns={
              hasRole('ADMIN')
                ? ['id', 'eventId', 'price', 'status', 'userId']
                : ['id', 'eventId', 'price', 'status']
            }
            linkBase="/tickets"
          />
        )}
      />
    </PageLayout>
  );
}
