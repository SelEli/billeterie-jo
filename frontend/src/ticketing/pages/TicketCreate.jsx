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
  const [loading, setLoading] = useState(false);

  // Création auto dès qu'on a event + offre
  useEffect(() => {
    const create = async () => {
      if (selectedEvent && selectedOffer) {
        setLoading(true);
        try {
          const price =
            selectedEvent.basePrice -
            (selectedEvent.basePrice * selectedOffer.discount) / 100;

          // 1️⃣ Création du ticket en BDD
          const newTicket = await createTicket({
            userId: user.id,
            eventId: selectedEvent.id,
            offerId: selectedOffer.id,
            status: 'RESERVED',
            zone: 'A', // valeur par défaut ou choisie ailleurs
            price
          });

          // Extraction prudente de l'ID
          const ticketId = newTicket?.id ?? newTicket?.data?.id;
          if (!ticketId) {
            console.error('ID ticket invalide', newTicket);
            return; // on sort pour éviter boucle infinie
          }

          // 2️⃣ Lecture de confirmation (noCache si supporté)
          const confirmed = await getTicket(ticketId, { noCache: true });

          if (confirmed && (confirmed.id || confirmed.data?.id)) {
            // 3️⃣ Navigation vers paiement
            navigate(`/pay/start?ticketId=${ticketId}`);
          } else {
            console.error('Ticket pas encore dispo en BDD, réessayer plus tard');
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
        <p>Préparation de la création…</p>
      )}
    </PageLayout>
  );
}
