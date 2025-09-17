import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PageLayout from '../../common/components/PageLayout';
import { createTicket, getTicket } from '../api/ticket';
import { useAuth } from '../../common/context/AuthContext';
import { mockEvents, mockOffers } from '../constants/mocks';

export default function TicketCreate() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [selectedOffer, setSelectedOffer] = useState(null);
  const [selectedZone, setSelectedZone] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const create = async () => {
      if (selectedEvent && selectedOffer && selectedZone) {
        setLoading(true);
        try {
          const price = selectedEvent.basePrice * (1 - selectedOffer.discount); // discount fraction

          const newTicket = await createTicket({
            userId: user.id,
            eventId: selectedEvent.id,
            offerId: selectedOffer.id,
            status: 'RESERVED',
            zone: selectedZone,
            price
          });

          const ticketId = newTicket?.data?.id ?? newTicket?.id;
          if (!ticketId) return;

          const confirmed = await getTicket(ticketId, { noCache: true });
          if (confirmed && (confirmed.id || confirmed.data?.id)) {
            navigate(`/pay/start?ticketId=${ticketId}`);
          }
        } catch (err) {
          console.error('Erreur création ticket', err);
        } finally {
          setLoading(false);
        }
      }
    };
    create();
  }, [selectedEvent, selectedOffer, selectedZone, navigate, user]);

  return (
    <PageLayout title="Créer un ticket">
      {loading ? (
        <p>Création du ticket en cours…</p>
      ) : !selectedEvent ? (
        <>
          <h3>Choisissez un événement</h3>
          <ul>
            {mockEvents.map(ev => (
              <li key={ev.id}>
                <button
                  onClick={() => setSelectedEvent(ev)}
                  className="btn btn--secondary"
                  disabled={ev.remainingCapacity === 0}
                >
                  {ev.label} {ev.remainingCapacity === 0 && '(Complet)'}
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
                  {of.label} ({of.discount * 100}%)
                </button>
              </li>
            ))}
          </ul>
        </>
      ) : !selectedZone ? (
        <>
          <h3>Choisissez une zone pour {selectedEvent.label}</h3>
          <ul>
            {selectedEvent.zones.map(z => (
              <li key={z}>
                <button
                  onClick={() => setSelectedZone(z)}
                  className="btn btn--secondary"
                >
                  Zone {z}
                </button>
              </li>
            ))}
          </ul>
        </>
      ) : (
        <p>Préparation de la création…</p>
      )}
    </PageLayout>
  );
}
