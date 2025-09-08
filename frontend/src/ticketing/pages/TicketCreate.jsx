import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PageLayout from '../../common/components/PageLayout';
import TicketForm from '../components/TicketForm';
import { createTicket } from '../api/ticket';
import { useAuth } from '../../common/context/AuthContext';

// Mock temporaire
const mockEvents = [
  { id: 1, label: 'Cérémonie ouverture JO' },
  { id: 2, label: 'Finale 100m' }
];
const mockOffers = [
  { id: 1, label: 'Simple', discount: 0 },
  { id: 2, label: 'Duo', discount: 10 },
  { id: 3, label: 'Famille', discount: 20 }
];

export default function TicketCreate() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [selectedOffer, setSelectedOffer] = useState(null);

  const handleSubmit = async (values) => {
    const allowed = (({ price, zone, status, eventId, offerId }) => ({
      price,
      zone,
      status,
      eventId,
      offerId
    }))(values);

    const newTicket = await createTicket(allowed);
    navigate(`/payment/start?ticketId=${newTicket.id}`);
  };

  return (
    <PageLayout title="Créer un ticket">
      {!selectedEvent ? (
        <>
          <h3>Choisissez un événement</h3>
          <ul>
            {mockEvents.map(ev => (
              <li key={ev.id}>
                <button onClick={() => setSelectedEvent(ev)} className="btn btn--secondary">
                  {ev.label}
                </button>
              </li>
            ))}
          </ul>
        </>
      ) : !selectedOffer ? (
        <>
          <h3>Choisissez une offre pour {selectedEvent.label}</h3>
          <ul>
            {mockOffers.map(of => (
              <li key={of.id}>
                <button onClick={() => setSelectedOffer(of)} className="btn btn--secondary">
                  {of.label} ({of.discount}%)
                </button>
              </li>
            ))}
          </ul>
        </>
      ) : (
        <>
          <h3>Création pour {selectedEvent.label} - Offre {selectedOffer.label}</h3>
          <TicketForm
            initialValues={{
              eventId: selectedEvent.id,
              offerId: selectedOffer.id,
              status: 'RESERVED',
              price: 100 - (100 * selectedOffer.discount / 100)
            }}
            onSubmit={handleSubmit}
            submitLabel="Créer et payer"
            isEdit={false}
            createdById={user.id}
          />
        </>
      )}
    </PageLayout>
  );
}
