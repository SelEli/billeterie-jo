// src/ticketing/pages/OfferList.jsx
import { useNavigate } from 'react-router-dom';
import PageLayout from '../../common/components/PageLayout';
import List from '../../common/components/List';
import Pagination from '../../common/components/Pagination';
import { listOffers, deleteOffer } from '../api/offer';
import { useAuth } from '../../common/context/AuthContext';
import OfferStatusBadge from '../components/OfferStatusBadge';

export default function OfferList() {
  const navigate = useNavigate();
  const { user, loading, hasRole } = useAuth();

  const fetchFn = async (params) => listOffers(params);

  if (loading) {
    return (
      <PageLayout title="Offres">
        <p>Chargement...</p>
      </PageLayout>
    );
  }

  return (
    <PageLayout title="Offres">
      <div className="actions-bar">
        {user && hasRole('ADMIN') && (
          <button
            className="btn btn--primary"
            onClick={() => navigate('/offer/create')}
          >
            Créer une offre
          </button>
        )}
      </div>

      <Pagination
        fetchFn={fetchFn}
        render={(offers = []) => (
          <List
            data={offers}
            columns={['id', 'label', 'discount', 'eventId', 'active', 'actions']}
            linkBase="/offer"
            renderCell={(col, value, row) => {
              if (col === 'active') {
                return <OfferStatusBadge active={row.active} />;
              }

              if (col === 'actions') {
                return hasRole('ADMIN') ? (
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button
                      type="button"
                      className="btn btn--sm btn--secondary"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        navigate(`/offer/${row.id}/edit`);
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
                        if (window.confirm('Supprimer cette offre ?')) {
                          await deleteOffer(row.id);
                          window.location.reload();
                        }
                      }}
                    >
                      Supprimer
                    </button>
                  </div>
                ) : null;
              }

              return value;
            }}
          />
        )}
      />
    </PageLayout>
  );
}
