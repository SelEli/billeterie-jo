// src/event/pages/EventDetail.jsx
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
          <div className="event-detail">
            <h2>{event.label}</h2>
            <p>
              <strong>Statut :</strong>{' '}
              <EventStatusBadge status={(event.status || '').toUpperCase()} />
            </p>
            <p><strong>Catégorie :</strong> {event.category || '—'}</p>
            <p><strong>Lieu :</strong> {event.location}</p>
            <p><strong>Date :</strong> {new Date(event.date).toLocaleString()}</p>
            <p><strong>Capacité :</strong> {event.capacity ?? '—'}</p>
            <p><strong>Prix de base :</strong> {event.basePrice} €</p>
            <p><strong>Zones :</strong> {event.zones?.join(', ') || '—'}</p>
            <p><strong>Description :</strong> {event.description || '—'}</p>
            {event.imageUrl && (
              <div className="event-image">
                <img src={event.imageUrl} alt={event.label} style={{ maxWidth: '300px' }} />
              </div>
            )}

            <div className="event-meta">
              <p><strong>Créé le :</strong> {new Date(event.createdAt).toLocaleString()}</p>
              <p><strong>Mis à jour le :</strong> {new Date(event.updatedAt).toLocaleString()}</p>
            </div>

            {hasRole('ADMIN') && (
              <div className="actions-bar">
                <button
                  className="btn btn--secondary"
                  onClick={() => navigate(`/event/${event.id}/edit`)}
                >
                  Modifier
                </button>
                <button className="btn btn--danger" onClick={handleDelete}>
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
