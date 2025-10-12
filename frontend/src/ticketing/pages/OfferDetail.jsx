import { useParams, useNavigate } from 'react-router-dom';
import Detail from '../../common/components/Detail';
import { getOffer, deleteOffer } from '../api/offer';
import { useAuth } from '../../common/context/AuthContext';

export default function OfferDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { hasRole } = useAuth();

  const handleDelete = async () => {
    if (!window.confirm('Confirmer la suppression ?')) return;
    await deleteOffer(id);
    navigate('/offer');
  };

  return (
    <Detail
      id={id}
      title={`Offre #${id}`}
      fetchFn={(offerId) =>
        getOffer(offerId, { noCache: true }).then(res => res.data || res)
      }
    >
      {(offer) => (
        <div className="ticket-detail-container">
          {/* Actions haut */}
          <div className="ticket-actions-top">
            <button
              className="btn btn--secondary"
              onClick={() => navigate('/offer')}
            >
              ← Retour aux offres
            </button>

            {hasRole('ADMIN') && (
              <div className="ticket-actions-right">
                <button
                  className="btn btn--secondary"
                  onClick={() => navigate(`/offer/${id}/edit`)}
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

          {/* Carte offre */}
          <div className="ticket-card print-area">
            <div className="ticket-banner">💸 Offre Spéciale – Paris 2025</div>

            <div className="ticket-content">
              <h2 className="ticket-title">{offer.label}</h2>

              <div className="ticket-info-grid">
                <p><strong>ID :</strong> {offer.id}</p>
                <p><strong>Réduction :</strong> {Math.round(offer.discount * 100)}%</p>
                <p><strong>Active :</strong> {offer.active ? 'Oui' : 'Non'}</p>
                {offer.validFrom && (
                  <p><strong>Valide à partir de :</strong> {new Date(offer.validFrom).toLocaleString()}</p>
                )}
                {offer.validTo && (
                  <p><strong>Valide jusqu’à :</strong> {new Date(offer.validTo).toLocaleString()}</p>
                )}
                {offer.quota && (
                  <p><strong>Quota :</strong> {offer.quota}</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </Detail>
  );
}
