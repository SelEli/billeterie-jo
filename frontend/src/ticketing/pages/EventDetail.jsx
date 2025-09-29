// src/ticketing/pages/EventDetail.jsx
import { useParams, useNavigate } from 'react-router-dom';
import PageLayout from '../../common/components/PageLayout';
import Detail from '../../common/components/Detail';
import { getEvent, deleteEvent } from '../api/event';
import { useAuth } from '../../common/context/AuthContext';
import EventStatusBadge from '../components/EventStatusBadge';

export default function EventDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { hasRole } = useAuth();

  const handleDelete = async () => {
    if (!window.confirm('Confirmer la suppression ?')) return;
    await deleteEvent(id);
    navigate('/event');
  };

  return (
    <PageLayout title={`Événement #${id}`}>
      <Detail
        id={id}
        fetchFn={(eventId) =>
          getEvent(eventId, { noCache: true }).then(res => res.data || res)
        }
      >
        {(event) => (
          <div>
            <h2>{event.label}</h2>
            <p><strong>Catégorie :</strong> {event.category}</p>
            <p><strong>Date :</strong> {new Date(event.date).toLocaleString()}</p>
            <p><strong>Lieu :</strong> {event.location}</p>
            <p><strong>Statut :</strong> <EventStatusBadge status={event.status} /></p>

            {hasRole('ADMIN') && (
              <div style={{ marginTop: '1rem' }}>
                <button
                  className="btn btn--secondary"
                  onClick={() => navigate(`/event/${id}/edit`)}
                >
                  Modifier
                </button>
                <button
                  className="btn btn--danger"
                  style={{ marginLeft: '0.5rem' }}
                  onClick={handleDelete}
                >
                  Supprimer
                </button>
              </div>
            )}
          </div>
        )}
      </Detail>
    </PageLayout>
  );
}
