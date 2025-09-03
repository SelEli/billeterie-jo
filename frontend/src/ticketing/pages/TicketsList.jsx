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
  const { user, loading, hasRole } = useAuth();

  const handleCreate = async (values) => {
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

  const fetchFn = async (params) => {
    if (!user) return [];
    if (hasRole && hasRole('ADMIN')) {
      return listTickets(params);
    }
    return listTickets({ ...params, userId: user.id });
  };

  if (loading) {
    return (
      <PageLayout title="Tickets">
        <p>Chargement...</p>
      </PageLayout>
    );
  }

  return (
    <PageLayout title="Tickets">
      <div className="actions-bar">
        {user && (
          <button
            className="btn btn--primary"
            onClick={() => setShowForm(v => !v)}
          >
            {showForm ? 'Fermer' : 'Créer un ticket'}
          </button>
        )}
      </div>

      {showForm && user && (
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
        render={(tickets = []) => (
          <List
            data={tickets}
            columns={
              hasRole && hasRole('ADMIN')
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
