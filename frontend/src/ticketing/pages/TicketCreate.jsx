import { useState, useEffect, useMemo } from 'react';
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
  const [selectedZone, setSelectedZone] = useState(null);
  const [loading, setLoading] = useState(false);

  // Charger les events et offers réels au montage
  useEffect(() => {
    const fetchData = async () => {
      try {
        const evs = await listEvents();
        setEvents(evs?.data ?? evs ?? []);
        const ofs = await listOffers();
        setOffers(ofs?.data ?? ofs ?? []);
      } catch (err) {
        console.error('Erreur chargement events/offers', err);
      }
    };
    fetchData();
  }, []);

  // Prix estimé (affichage uniquement)
  const estimatedPrice = useMemo(() => {
    if (!selectedEvent) return null;
    let price = selectedEvent.basePrice ?? 0;
    if (selectedOffer?.discount) {
      price = price * (1 - selectedOffer.discount);
    }
    return price.toFixed(2);
  }, [selectedEvent, selectedOffer]);

  // Création du ticket quand tout est choisi
  useEffect(() => {
    const create = async () => {
      if (selectedEvent && selectedZone) {
        setLoading(true);
        try {
          // ✅ Payload minimal, le back calcule le prix
          const payload = {
            userId: user.id,
            eventId: selectedEvent.id,
            status: 'RESERVED',
            zone: selectedZone
          };

          if (selectedOffer?.id) {
            payload.offerId = selectedOffer.id;
          }

          const newTicket = await createTicket(payload);

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
            {events.map(ev => (
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
            {offers
              // ⚠️ si tu passes au N-N, adapte ce filtre
              .filter(of => of.eventId === selectedEvent.id)
              .map(of => (
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
            {(selectedEvent.zones ?? []).map(z => (
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
          {estimatedPrice && (
            <p className="mt-2">
              💶 Prix estimé : <strong>{estimatedPrice} €</strong>
            </p>
          )}
        </>
      ) : (
        <>
          <p>Préparation de la création…</p>
          {estimatedPrice && (
            <p>
              💶 Prix estimé : <strong>{estimatedPrice} €</strong>
            </p>
          )}
        </>
      )}
    </PageLayout>
  );
}
