// frontend/src/ticketing/pages/OfferCreate.jsx
import { useNavigate } from 'react-router-dom';
import PageLayout from '../../common/components/PageLayout';
import OfferForm from '../components/OfferForm';
import { createOffer } from '../api/offer';
import { useAuth } from '../../common/context/AuthContext';

export default function OfferCreate() {
  const navigate = useNavigate();
  const { hasRole } = useAuth();

  if (!hasRole('ADMIN')) {
    return (
      <PageLayout title="Créer une offre">
        <p>Accès réservé aux administrateurs.</p>
      </PageLayout>
    );
  }

  const handleSubmit = async (values) => {
    const newOffer = await createOffer(values);
    // ⚠️ le back renvoie { data: { offerId: ... } }
    const id = newOffer?.data?.offerId ?? newOffer?.id;
    if (id) navigate(`/offer/${id}`);
  };

  return (
    <PageLayout title="Créer une offre">
      <OfferForm initialValues={{}} onSubmit={handleSubmit} isEdit />
    </PageLayout>
  );
}
