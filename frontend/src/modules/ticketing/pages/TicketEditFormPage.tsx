import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { getTicket, updateTicket } from '../api/ticketApi';

export function TicketEditForm() {
  const { id } = useParams();
  const [title, setTitle] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (id) getTicket(id).then((t) => t && setTitle(t.title));
  }, [id]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (id) updateTicket(id, { title }).then(() => navigate('/tickets'));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
      <h2 className="text-xl font-bold">Modifier billet</h2>
      <input
        className="border p-2 w-full"
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Titre"
        required
      />
      <button className="bg-green-600 text-white px-4 py-2">Valider</button>
    </form>
  );
}
