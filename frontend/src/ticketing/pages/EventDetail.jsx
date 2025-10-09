// src/ticketing/pages/EventDetail.jsx
import { useParams, useNavigate } from 'react-router-dom';
import Detail from '../../common/components/Detail';
import { getEvent, deleteEvent } from '../api/event';
import { useAuth } from '../../common/context/AuthContext';

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
    <Detail
      id={id}
      title={`Événement #${id}`}
      fetchFn={(eventId) =>
        getEvent(eventId, { noCache: true }).then(res => res.data || res)
      }
    >
      {(event) => (
        <div className="ticket-detail-container">
          {/* Actions haut */}
          <div className="ticket-actions-top">
            <button
              className="btn btn--secondary"
              onClick={() => navigate('/event')}
            >
              ← Retour aux événements
            </button>

            {hasRole('ADMIN') && (
              <div className="ticket-actions-right">
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

          {/* Carte event */}
          <div className="ticket-card print-area">
            <div className="ticket-banner">📅 Événement Officiel – Paris 2025</div>

            <div className="ticket-content">
              <h2 className="ticket-title">
                {event.label}
              </h2>

              {/* Infos officielles */}
              <div className="ticket-info-grid">
                <p><strong>Catégorie :</strong> {event.category}</p>
                <p><strong>Date :</strong> {new Date(event.date).toLocaleDateString()}</p>
                <p><strong>Heure :</strong> {new Date(event.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                <p><strong>Lieu :</strong> {event.location}</p>
                <p><strong>Capacité :</strong> {event.capacity}</p>
                <p><strong>Statut :</strong> {event.status}</p>
              </div>

              {event.description && (
                <>
                  <h3 className="ticket-section-title">📝 Description</h3>
                  <p>{event.description}</p>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </Detail>
  );
}
