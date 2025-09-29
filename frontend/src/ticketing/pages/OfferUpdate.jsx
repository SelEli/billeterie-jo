// src/offer/pages/OfferUpdate.jsx
import { useParams, useNavigate } from 'react-router-dom';
import PageLayout from '../../common/components/PageLayout';
import OfferForm from '../components/OfferForm';
import { getOffer, updateOffer } from '../api/offer';
import { useEffect, useState } from 'react';

export default function OfferUpdate() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [initialValues, setInitialValues] = useState(null);

  useEffect(() => {
    getOffer(id).then(res => setInitialValues(res.data || res));
  }, [id]);

  const handleSubmit = async (values) => {
    await updateOffer(id, values);
    navigate(`/offer/${id}`);
  };

  if (!initialValues) return <p>Chargement...</p>;

  return (
    <PageLayout title={`Modifier l’offre #${id}`}>
      <OfferForm initialValues={initialValues} onSubmit={handleSubmit} isEdit />
    </PageLayout>
  );
}
