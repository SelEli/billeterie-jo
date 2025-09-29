import { useParams, useNavigate } from 'react-router-dom';
import PageLayout from '../../common/components/PageLayout';
import EventForm from '../components/EventForm';
import { getEvent, updateEvent } from '../api/event';
import { useEffect, useState } from 'react';

export default function EventUpdate() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [initialValues, setInitialValues] = useState(null);

  useEffect(() => {
    getEvent(id).then(res => setInitialValues(res.data || res));
  }, [id]);

  const handleSubmit = async (values) => {
    await updateEvent(id, values);
    navigate(`/event/${id}`);
  };

  if (!initialValues) return <p>Chargement...</p>;

  return (
    <PageLayout title={`Modifier l’événement #${id}`}>
      <EventForm initialValues={initialValues} onSubmit={handleSubmit} isEdit />
    </PageLayout>
  );
}
