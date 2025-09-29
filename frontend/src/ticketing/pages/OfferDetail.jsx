// src/offer/pages/OfferDetail.jsx
import { useParams, useNavigate } from 'react-router-dom';
import PageLayout from '../../common/components/PageLayout';
import Detail from '../../common/components/Detail';
import { getOffer, deleteOffer } from '../api/offer';
import { useAuth } from '../../common/context/AuthContext';
import OfferStatusBadge from '../components/OfferStatusBadge';

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
    <PageLayout title={`Offre #${id}`}>
      <Detail
        id={id}
        fetchFn={(offerId) =>
          getOffer(offerId, { noCache: true }).then(res => res.data || res)
        }
      >
        {(offer) => (
          <div className="offer-detail">
            <h2>{offer.label}</h2>
            <p>
              <strong>Statut :</strong>{' '}
              <OfferStatusBadge active={offer.active} />
            </p>
            <p><strong>Réduction :</strong> {Math.round(offer.discount * 100)}%</p>
            <p><strong>Événement lié :</strong> {offer.eventId ?? '—'}</p>
            <p><strong>Valide du :</strong> {offer.validFrom ? new Date(offer.validFrom).toLocaleString() : '—'}</p>
            <p><strong>Au :</strong> {offer.validTo ? new Date(offer.validTo).toLocaleString() : '—'}</p>
            <p><strong>Quota :</strong> {offer.quota ?? '—'}</p>

            <div className="offer-meta">
              <p><strong>Créé le :</strong> {new Date(offer.createdAt).toLocaleString()}</p>
              <p><strong>Mis à jour le :</strong> {new Date(offer.updatedAt).toLocaleString()}</p>
            </div>

            {hasRole('ADMIN') && (
              <div className="actions-bar">
                <button
                  className="btn btn--secondary"
                  onClick={() => navigate(`/offer/${offer.id}/edit`)}
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
