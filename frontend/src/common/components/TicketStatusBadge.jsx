import { TICKET_STATUS } from '../../common/utils/constants';

export default function TicketStatusBadge({ status }) {
  const info = TICKET_STATUS[status] || { label: status, icon: '', color: 'gray' };
  return (
    <span style={{ color: info.color, fontWeight: 'bold' }}>
      {info.icon} {info.label}
    </span>
  );
}
