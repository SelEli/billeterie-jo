import { useState } from 'react';
import { createTicket } from '../api/ticketApi';
import { useNavigate } from 'react-router-dom';

export function TicketCreateForm() {
  const [title, setTitle] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createTicket({ title, ownerId: 'u1', isPaid: false }).then(() =>
      navigate('/tickets')
    );
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
      <h2 className="text-xl font-bold">Créer un billet</h2>
      <input
        className="border p-2 w-full"
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Titre"
        required
      />
      <button className="bg-blue-600 text-white px-4 py-2">Créer</button>
    </form>
  );
}
