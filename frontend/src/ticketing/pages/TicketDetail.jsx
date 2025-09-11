import { useParams, useNavigate } from 'react-router-dom';
import Detail from '../../common/components/Detail';
import { getTicket, deleteTicket } from '../api/ticket';
import { useAuth } from '../../common/context/AuthContext';
import TicketStatusBadge from '../components/TicketStatusBadge';
import { QRCodeSVG } from 'qrcode.react';
import { useState } from 'react';
import ConfirmModal from '../../common/components/ConfirmModal';

export default function TicketDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, hasRole } = useAuth() || {};
  const safeHasRole = typeof hasRole === 'function' ? hasRole : () => false;
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const handleDelete = async () => {
    await deleteTicket(id);
    navigate('/ticket');
  };

  return (
    <Detail
      id={id}
      title={`Ticket #${id}`}
      // 🔹 Forcer un fetch direct depuis l'API pour avoir le statut à jour
      fetchFn={(ticketId) =>
        getTicket(ticketId, { noCache: true }).then(res => res.data || res)
      }
      formProps={{ readOnly: true }}
      actions={(ticket) => {
        const isOwner = ticket?.userId === user?.id;
        const canAdmin = safeHasRole('ADMIN');
        return (
          <>
            {(canAdmin || isOwner) && (
              <button
                className="btn btn--danger"
                onClick={() => setShowDeleteModal(true)}
              >
                Supprimer
              </button>
            )}
            {ticket?.status?.toUpperCase() === 'VALID' && (
              <button
                className="btn btn--print"
                onClick={() => window.print()}
              >
                🖨️ Imprimer
              </button>
            )}
          </>
        );
      }}
    >
      {(ticket) => {
        const status = (ticket?.status || '').toUpperCase();
        const isReserved = status === 'RESERVED';
        const isValid = status === 'VALID';

        return (
          <div className="ticket-card print-area">
            <div className="ticket-card__header">
              <TicketStatusBadge status={ticket.status} />
              <span className="ticket-card__status-label">
                {ticket.statusLabel || ''}
              </span>
            </div>

            <div className="ticket-card__body">
              <div className="ticket-info">
                <div><strong>Événement :</strong> {ticket.event?.name}</div>
                <div><strong>Type :</strong> {ticket.event?.type}</div>
                <div><strong>Cérémonie :</strong> {ticket.event?.ceremonyName}</div>
                {ticket.offer && (
                  <div><strong>Offre :</strong> {ticket.offer?.name}</div>
                )}
                <div><strong>Zone :</strong> {ticket.zone}</div>
                <div><strong>Prix :</strong> {ticket.price} €</div>
                <div><strong>Date :</strong> {ticket.event?.date}</div>
              </div>

              {isReserved && (
                <div className="alert-payment">
                  ⚠️ Ce ticket est réservé et <strong>le paiement n’a pas encore été effectué</strong>.
                  <button
                    className="btn btn--payment"
                    onClick={() => navigate(`/pay/start?ticketId=${ticket.id}`)}
                  >
                    Procéder au paiement
                  </button>
                </div>
              )}

              {isValid && (
                <div className="ticket-card__qr">
                  <QRCodeSVG
                    value={JSON.stringify({
                      ticketId: ticket.id,
                      eventId: ticket.eventId,
                      userId: ticket.userId,
                      zone: ticket.zone,
                      price: ticket.price,
                      issuedAt: ticket.updatedAt,
                      signature: ticket.signature
                    })}
                    size={160}
                  />
                  <p>Présentez ce QR code à l’entrée</p>
                </div>
              )}
            </div>

            {showDeleteModal && (
              <ConfirmModal
                title="Confirmer la suppression"
                message="Voulez-vous vraiment supprimer ce ticket ? Cette action est irréversible."
                onConfirm={handleDelete}
                onCancel={() => setShowDeleteModal(false)}
              />
            )}
          </div>
        );
      }}
    </Detail>
  );
}
