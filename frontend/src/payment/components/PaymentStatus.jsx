import TicketStatusBadge from '../../ticketing/components/TicketStatusBadge';

export default function PaymentStatus({ status }) {
  return (
    <div>
      <TicketStatusBadge status={status} />
    </div>
  );
}
