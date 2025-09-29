// src/ticketing/pages/EventCreate.jsx
import { useNavigate } from 'react-router-dom';
import PageLayout from '../../common/components/PageLayout';
import EventForm from '../components/EventForm';
import { createEvent } from '../api/event';
import { useAuth } from '../../common/context/AuthContext';

export default function EventCreate() {
  const navigate = useNavigate();
  const { hasRole } = useAuth();

  if (!hasRole('ADMIN')) {
    return (
      <PageLayout title="Créer un événement">
        <p>Accès réservé aux administrateurs.</p>
      </PageLayout>
    );
  }

  const handleSubmit = async (values) => {
    const newEvent = await createEvent(values);
    const id = newEvent?.data?.id ?? newEvent?.id;
    if (id) navigate(`/event/${id}`);
  };

  return (
    <PageLayout title="Créer un événement">
      <EventForm onSubmit={handleSubmit} />
    </PageLayout>
  );
}
