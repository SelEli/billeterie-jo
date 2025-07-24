import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { processPayment } from '../api/paymentApi';
import { Ticket } from '../../ticketing/types';
import { updateTicket, getTicket } from '../../ticketing/api/ticketApi';

export function PaymentForm(): JSX.Element {
  const { id } = useParams();
  const [cardNumber, setCardNumber] = useState('');
  const [status, setStatus] = useState<'idle' | 'pending' | 'paid' | 'failed'>('idle');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!id) return;

    setStatus('pending');

    const result = await processPayment({
      ticketId: id,
      amount: 50,
      cardNumber,
      status: 'pending',
    });

    if (result === 'paid') {
      await updateTicket(id, { isPaid: true });
      setStatus('paid');
      setTimeout(() => navigate(`/tickets/${id}`), 1500);
    } else {
      setStatus('failed');
    }
  };

  return (
    <div className="space-y-4 max-w-md mx-auto">
      <h2 className="text-xl font-bold">Paiement du billet</h2>
      {status === 'paid' && <p className="text-green-600">✅ Paiement réussi !</p>}
      {status === 'failed' && <p className="text-red-600">❌ Échec du paiement</p>}
      {status !== 'paid' && (
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            className="border p-2 w-full"
            type="text"
            placeholder="Numéro de carte"
            value={cardNumber}
            onChange={(e) => setCardNumber(e.target.value)}
            required
          />
          <button
            type="submit"
            className="bg-indigo-600 text-white px-4 py-2 rounded"
            disabled={status === 'pending'}
          >
            {status === 'pending' ? 'Paiement en cours…' : 'Payer 50€'}
          </button>
        </form>
      )}
    </div>
  );
}
