import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PageLayout from '../../common/components/PageLayout';
import { createTicket, getTicket } from '../api/ticket';
import { listEvents } from '../api/event';
import { listOffers } from '../api/offer';
import { useAuth } from '../../common/context/AuthContext';

export default function TicketCreate() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [events, setEvents] = useState([]);
  const [offers, setOffers] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [selectedOffer, setSelectedOffer] = useState(null);
  const [loading, setLoading] = useState(false);

  // Charger events et offers depuis l’API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const evts = await listEvents();
        setEvents(evts?.data ?? evts ?? []);
        const ofs = await listOffers();
        setOffers(ofs?.data ?? ofs ?? []);
      } catch (err) {
        console.error('Erreur chargement events/offers', err);
      }
    };
    fetchData();
  }, []);

  // Création du ticket quand event + offer choisis
  useEffect(() => {
    const create = async () => {
      if (selectedEvent && selectedOffer) {
        setLoading(true);
        try {
          // ✅ Prix de base codé en dur (ex: 100€)
          const basePrice = 100;
          const price = basePrice * (1 - selectedOffer.discount);

          const newTicket = await createTicket({
            userId: user.id,
            eventId: selectedEvent.id,
            offerId: selectedOffer.id,
            status: 'RESERVED',
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
  }, [selectedEvent, selectedOffer, navigate, user]);

  return (
    <PageLayout title="Créer un ticket">
      {loading ? (
        <p>Création du ticket en cours…</p>
      ) : !selectedEvent ? (
        <>
          <h3>Choisissez un événement</h3>
          <ul>
            {Array.isArray(events) && events.map(ev => (
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
            {Array.isArray(offers) && offers.map(of => (
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
      ) : (
        <p>Préparation de la création…</p>
      )}
    </PageLayout>
  );
}
