import { useParams, useNavigate } from 'react-router-dom';
import Detail from '../../common/components/Detail';
import { getTicket, deleteTicket } from '../api/ticket';
import { QRCodeSVG } from 'qrcode.react';
import { useState } from 'react';
import { useAuth } from '../../common/context/AuthContext'; // 🔹 pour récupérer le rôle

export default function TicketDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [showMore, setShowMore] = useState(false);
  const { hasRole } = useAuth(); // 🔹 hook auth

  const handleDelete = async () => {
    if (!window.confirm('Confirmer la suppression ?')) return;
    await deleteTicket(id);
    navigate('/ticket');
  };

  return (
    <Detail
      id={id}
      title={`Ticket #${id}`}
      fetchFn={(ticketId) =>
        getTicket(ticketId, { noCache: true }).then(res => res.data || res)
      }
    >
      {(ticket) => {
        const status = (ticket?.status || '').toUpperCase();
        const isValid = status === 'VALID';
        const isReserved = status === 'RESERVED';
        const offer = ticket.offer;
        const event = ticket.event;
        const user = ticket.user || {};

        return (
          <div className="ticket-detail-container">
            {/* Actions haut */}
            <div className="ticket-actions-top">
              <button
                className="btn btn--secondary"
                onClick={() => navigate('/ticket')}
              >
                ← Retour aux tickets
              </button>

              <div className="ticket-actions-right">
                <button className="btn btn--danger" onClick={handleDelete}>
                  Supprimer
                </button>

                {isValid && (
                  <button className="btn btn--print" onClick={() => window.print()}>
                    🖨️ Imprimer
                  </button>
                )}
              </div>
            </div>

            {/* Carte ticket */}
            <div className="ticket-card print-area">
              <div className="ticket-banner">🎟️ Billet Officiel – Paris 2025</div>

              <div className="ticket-content">
                <h2 className="ticket-title">
                  Ticket #{ticket.id}
                  {isValid && <span className="ticket-valid">✔ Validé</span>}
                </h2>

                {/* Infos officielles */}
                <div className="ticket-info-grid">
                  <p><strong>Nom :</strong> {user.lastName || '—'}</p>
                  <p><strong>Prénom :</strong> {user.firstName || '—'}</p>
                  <p><strong>Date de naissance :</strong> {user.birthDate ? new Date(user.birthDate).toLocaleDateString() : '—'}</p>
                  <p><strong>Statut :</strong> {ticket.statusLabel || ticket.status}</p>
                  <p><strong>Zone :</strong> {ticket.zone}</p>
                  <p><strong>Prix :</strong> {Number(ticket.price).toFixed(2)} €</p>
                </div>

                {/* Alerte paiement + vérification */}
                {isReserved && (
                  <div className="ticket-warning">
                    ⚠️ Ce ticket est réservé mais <strong>le paiement n’a pas encore été effectué</strong>.  
                    Il ne sera valide qu’après règlement.
                    <div className="ticket-warning-btn" style={{ display: 'flex', gap: '0.5rem' }}>
                      <button
                        className="btn btn--payment"
                        onClick={() => navigate(`/pay/start?ticketId=${ticket.id}`)}
                      >
                        💳 Procéder au paiement
                      </button>

                      {/* Bouton Vérification réservé aux rôles habilités */}
                      {hasRole(['ADMIN', 'EMPLOYEE', 'AGENT']) && (
                        <button
                          className="btn btn--verification"
                          onClick={() => navigate(`/verification/start?ticketId=${ticket.id}`)}
                        >
                          ✅ Vérifier
                        </button>
                      )}
                    </div>
                  </div>
                )}

                {/* QR code */}
                {isValid && (
                  <div className="ticket-qr">
                    <QRCodeSVG
                      value={JSON.stringify({
                        ticketId: ticket.id,
                        eventId: ticket.eventId,
                        userId: ticket.userId,
                        zone: ticket.zone,
                        price: ticket.price,
                        issuedAt: ticket.updatedAt
                      })}
                      size={160}
                    />
                    <p>Présentez ce QR code à l’entrée</p>
                  </div>
                )}

                {/* Bouton afficher plus */}
                <div className="ticket-showmore">
                  <button
                    className="btn btn--secondary"
                    onClick={() => setShowMore(v => !v)}
                  >
                    {showMore ? 'Masquer les détails' : 'Afficher plus de détails'}
                  </button>
                </div>

                {showMore && (
                  <>
                    {/* Infos techniques */}
                    <div className="ticket-info-grid mt-1">
                      <p><strong>Créé le :</strong> {new Date(ticket.createdAt).toLocaleString()}</p>
                      <p><strong>Mis à jour le :</strong> {new Date(ticket.updatedAt).toLocaleString()}</p>
                      <p><strong>ID Utilisateur :</strong> {ticket.userId}</p>
                      <p><strong>ID Événement :</strong> {ticket.eventId}</p>
                      <p><strong>ID Offre :</strong> {ticket.offerId}</p>
                    </div>

                    {/* Event */}
                    {event && (
                      <>
                        <h3 className="ticket-section-title">📅 Événement</h3>
                        <div className="ticket-info-grid">
                          <p><strong>ID :</strong> {event.id}</p>
                          <p><strong>Nom :</strong> {event.label}</p>
                          <p><strong>Catégorie :</strong> {event.category}</p>
                          <p><strong>Lieu :</strong> {event.location}</p>
                          <p><strong>Date :</strong> {new Date(event.date).toLocaleDateString()}</p>
                          <p><strong>Heure :</strong> {new Date(event.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                        </div>
                      </>
                    )}

                    {/* Offer */}
                    {offer && (
                      <>
                        <h3 className="ticket-section-title">💸 Offre</h3>
                        <div className="ticket-info-grid">
                          <p><strong>ID :</strong> {offer.id}</p>
                          <p><strong>Nom :</strong> {offer.label}</p>
                          <p><strong>Réduction :</strong> {Math.round(offer.discount * 100)}%</p>
                          <p><strong>Active :</strong> {offer.active ? 'Oui' : 'Non'}</p>
                        </div>
                      </>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        );
      }}
    </Detail>
  );
}
