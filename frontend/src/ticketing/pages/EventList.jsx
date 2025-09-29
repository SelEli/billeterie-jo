// src/event/pages/EventList.jsx
import { useNavigate } from 'react-router-dom';
import PageLayout from '../../common/components/PageLayout';
import List from '../../common/components/List';
import Pagination from '../../common/components/Pagination';
import { listEvents, deleteEvent } from '../api/event';
import { useAuth } from '../../common/context/AuthContext';
import EventStatusBadge from '../components/EventStatusBadge';

export default function EventList() {
  const navigate = useNavigate();
  const { user, loading, hasRole } = useAuth();

  const fetchFn = async (params) => listEvents(params);

  if (loading) {
    return (
      <PageLayout title="Événements">
        <p>Chargement...</p>
      </PageLayout>
    );
  }

  return (
    <PageLayout title="Événements">
      <div className="actions-bar">
        {user && hasRole('ADMIN') && (
          <button
            className="btn btn--primary"
            onClick={() => navigate('/event/create')}
          >
            Créer un événement
          </button>
        )}
      </div>

      <Pagination
        fetchFn={fetchFn}
        render={(events = []) => (
          <List
            data={events}
            columns={['id', 'label', 'category', 'date', 'location', 'status', 'actions']}
            linkBase="/event"
            renderCell={(col, value, row) => {
              if (col === 'date') {
                return new Date(value).toLocaleDateString('fr-FR', {
                  day: '2-digit',
                  month: '2-digit',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                });
              }

              if (col === 'status') {
                return <EventStatusBadge status={(value || '').toUpperCase()} />;
              }

              if (col === 'actions') {
                return (
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    {hasRole('ADMIN') && (
                      <>
                        <button
                          type="button"
                          className="btn btn--sm btn--secondary"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            navigate(`/event/${row.id}/edit`);
                          }}
                        >
                          Modifier
                        </button>
                        <button
                          type="button"
                          className="btn btn--sm btn--danger"
                          onClick={async (e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            if (window.confirm('Supprimer cet événement ?')) {
                              await deleteEvent(row.id);
                              window.location.reload();
                            }
                          }}
                        >
                          Supprimer
                        </button>
                      </>
                    )}
                  </div>
                );
              }

              return value;
            }}
          />
        )}
      />
    </PageLayout>
  );
}
