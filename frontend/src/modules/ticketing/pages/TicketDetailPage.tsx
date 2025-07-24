import { useParams, Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { getTicket, deleteTicket } from '../api/ticketApi';
import { Ticket } from '../types';

export function TicketDetail() {
  const { id } = useParams();
  const [ticket, setTicket] = useState<Ticket | null>(null);

  useEffect(() => {
    if (id) getTicket(id).then(setTicket);
  }, [id]);

  const handleDelete = () => {
    if (id) deleteTicket(id).then(() => window.location.href = '/tickets');
  };

  if (!ticket) return <p>Chargement...</p>;

  return (
    <div className="space-y-2">
      <h2 className="text-2xl font-bold">{ticket.title}</h2>
      <p>Statut : {ticket.isPaid ? '✅ Payé' : '❌ Non payé'}</p>
      <Link to={`/tickets/${ticket.id}/edit`} className="text-blue-600 underline">✏️ Modifier</Link>
      <button onClick={handleDelete} className="text-red-600 ml-4">🗑️ Supprimer</button>
    </div>
  );
}
