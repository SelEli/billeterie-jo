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

  // 🔴 Définition des champs à afficher
  const eventFields = [
    { key: 'category', label: 'Catégorie' },
    { key: 'date', label: 'Date', format: (val) => new Date(val).toLocaleDateString() },
    { key: 'date', label: 'Heure', format: (val) => new Date(val).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) },
    { key: 'location', label: 'Lieu' },
    { key: 'capacity', label: 'Capacité' },
    { key: 'status', label: 'Statut' },
    { key: 'basePrice', label: 'Prix de base', format: (val) => `${val} €` },
    { key: 'zones', label: 'Zones', format: (val) => val?.join(', ') }
  ];

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
              <h2 className="ticket-title">{event.label}</h2>

              {/* Infos officielles */}
              <div className="ticket-info-grid">
                {eventFields.map(({ key, label, format }) => (
                  <p key={label}>
                    <strong>{label} :</strong>{' '}
                    {format ? format(event[key]) : event[key]}
                  </p>
                ))}
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
