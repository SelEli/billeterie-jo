import { useNavigate, useLocation } from 'react-router-dom';
import PageLayout from '../../common/components/PageLayout';
import PaymentForm from '../components/PaymentForm';
import { startPayment } from '../api/payment';
import { getTicket } from '../../ticketing/api/ticket';
import { useState, useEffect } from 'react';

export default function PaymentStart() {
  const navigate = useNavigate();
  const query = new URLSearchParams(useLocation().search);
  const ticketId = query.get('ticketId');
  const [loading, setLoading] = useState(false);
  const [ticket, setTicket] = useState(null);

  useEffect(() => {
    if (!ticketId) {
      navigate('/ticket');
    } else {
      getTicket(ticketId, { noCache: true })
        .then(res => setTicket(res?.data || res))
        .catch(() => navigate('/ticket'));
    }
  }, [ticketId, navigate]);

  const handlePay = async () => {
    const numericId = Number(ticketId);
    if (Number.isNaN(numericId)) return navigate('/ticket');
    setLoading(true);
    try {
      await startPayment(numericId);
      navigate(`/pay/confirm?ticketId=${numericId}`);
    } catch {
      navigate(`/pay/failed?ticketId=${numericId}`);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => navigate(`/ticket/${ticketId}`);

  return (
    <PageLayout title="Paiement" titleClassName="page-title is-centered">
      <div className="card-jo">
        {ticket && (
          <div className="payment-summary mb-4">
            <h2>Détails du ticket</h2>
            <p><strong>Numéro :</strong> {ticket.id}</p>
            <p><strong>Événement :</strong> {ticket.event?.label || '—'}</p>
            <p><strong>Date :</strong> {ticket.event?.date ? new Date(ticket.event.date).toLocaleDateString() : '—'}</p>
            <p><strong>Zone :</strong> {ticket.zone}</p>
            <p><strong>Montant :</strong> {Number(ticket.price).toFixed(2)} €</p>
          </div>
        )}
        <PaymentForm onPay={handlePay} onCancel={handleCancel} loading={loading} />
      </div>
    </PageLayout>
  );
}
