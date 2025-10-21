// src/ticketing/components/EventStatusBadge.jsx
import { EVENT_STATUS } from '../../common/utils/constants';

export default function EventStatusBadge({ status }) {
  const info = EVENT_STATUS[status] || { label: status || '—', icon: '', color: 'gray' };

  return (
    <span
      className="inline-flex items-center gap-2 px-2 py-1 rounded text-sm"
      style={{
        backgroundColor: `${info.color}1A`,
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
