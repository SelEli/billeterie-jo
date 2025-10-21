import TicketStatusBadge from '../../ticketing/components/TicketStatusBadge';

/**
 * Affiche le statut de vérification d’un ticket
 * @param {string} status - ex: "VALID", "INVALID", "FORCED"
 */
export default function VerificationStatus({ status }) {
  return (
    <div>
      <TicketStatusBadge status={status} />
    </div>
  );
}
