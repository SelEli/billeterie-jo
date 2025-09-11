import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PageLayout from '../../common/components/PageLayout';
import { createTicket } from '../api/ticket';
import { useAuth } from '../../common/context/AuthContext';
import { mockEvents, mockOffers } from '../constants/mocks';

export default function TicketCreate() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [selectedOffer, setSelectedOffer] = useState(null);

  // Création auto dès qu'on a event + offre
  useEffect(() => {
    const create = async () => {
      if (selectedEvent && selectedOffer) {
        try {
          const price =
            selectedEvent.basePrice -
            (selectedEvent.basePrice * selectedOffer.discount) / 100;

          const newTicket = await createTicket({
            userId: user.id, // ✅ champ attendu par le backend
            eventId: selectedEvent.id,
            offerId: selectedOffer.id,
            status: 'RESERVED',
            zone: 'A', // valeur par défaut ou choisie ailleurs
            price
          });

          navigate(`/pay/start?ticketId=${newTicket.id}`);
        } catch (err) {
          console.error('Erreur création ticket', err);
        }
      }
    };
    create();
  }, [selectedEvent, selectedOffer, navigate, user]);

  return (
    <PageLayout title="Créer un ticket">
      {!selectedEvent ? (
        <>
          <h3>Choisissez un événement</h3>
          <ul>
            {mockEvents.map(ev => (
              <li key={ev.id}>
                <button
                  onClick={() => setSelectedEvent(ev)}
                  className="btn btn--secondary"
                >
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
                <button
                  onClick={() => setSelectedOffer(of)}
                  className="btn btn--secondary"
                >
                  {of.label} ({of.discount}%)
                </button>
              </li>
            ))}
          </ul>
        </>
      ) : (
        <p>Création du ticket en cours…</p>
      )}
    </PageLayout>
  );
}
