import { useNavigate } from 'react-router-dom';
import PageLayout from '../../common/components/PageLayout';
import List from '../../common/components/List';
import Pagination from '../../common/components/Pagination';
import { listTickets } from '../api/ticket';
import { useAuth } from '../../common/context/AuthContext';
import TicketStatusBadge from '../components/TicketStatusBadge';

export default function TicketsList() {
  const navigate = useNavigate();
  const { user, loading, hasRole } = useAuth();

  const fetchFn = async (params) => {
    if (!user) {
      return { data: [], meta: { pagination: { total: 0 } } };
    }

    const finalParams = hasRole && hasRole('ADMIN')
      ? params
      : { ...params, userId: user.id };

    // On renvoie la réponse brute de l'API (data + meta)
    return listTickets(finalParams);
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
            onClick={() => navigate('/ticket/create')}
          >
            Créer un ticket
          </button>
        )}
      </div>

      <Pagination
        fetchFn={fetchFn}
        render={(tickets = []) => (
          <List
            data={tickets}
            columns={['id', 'eventId', 'price', 'status', 'actions']}
            linkBase="/ticket"
            renderCell={(col, value, row) => {
              if (col === 'status') {
                return <TicketStatusBadge status={(value || '').toUpperCase()} />;
              }

              if (col === 'actions') {
                if ((row.status || '').toUpperCase() === 'RESERVED') {
                  return (
                    <button
                      type="button"
                      className="btn btn--primary btn--sm"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        navigate(`/pay/start?ticketId=${row.id}`);
                      }}
                    >
                      Payer
                    </button>
                  );
                }
                return null;
              }

              return value;
            }}
          />
        )}
      />
    </PageLayout>
  );
}
