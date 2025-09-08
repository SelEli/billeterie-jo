// src/ticketing/components/TicketStatusBadge.jsx
import { TICKET_STATUS } from '../../common/utils/constants';

export default function TicketStatusBadge({ status }) {
  const info = TICKET_STATUS[status] || { label: status || '—', icon: '', color: 'gray' };

  return (
    <span
      className="inline-flex items-center gap-2 px-2 py-1 rounded text-sm"
      style={{
        backgroundColor: `${info.color}1A`, // légère teinte (10%)
        color: info.color,
        fontWeight: '600'
      }}
      title={info.label}
    >
      <span aria-hidden="true">{info.icon}</span>
      <span>{info.label}</span>
    </span>
  );
}
