import { useEffect, useState } from 'react';
import { getTickets } from '../api/ticketApi';
import { Ticket } from '../types';
import { Link } from 'react-router-dom';

export function TicketList() {
  const [tickets, setTickets] = useState<Ticket[]>([]);

  useEffect(() => {
    getTickets().then(setTickets);
  }, []);

  return (
    <div>
      <h2 className="text-xl font-bold">Mes billets</h2>
      <ul className="space-y-2 mt-4">
        {tickets.map((ticket) => (
          <li key={ticket.id} className="p-2 border rounded">
            <Link to={`/tickets/${ticket.id}`}>
              🎫 {ticket.title} – {ticket.isPaid ? 'Payé' : 'À payer'}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
