import { useNavigate, useLocation } from 'react-router-dom';
import PageLayout from '../../common/components/PageLayout';
import PaymentForm from '../components/PaymentForm';
import { startPayment } from '../api/payment';
import { useState, useEffect } from 'react';

export default function PaymentStart() {
  const navigate = useNavigate();
  const query = new URLSearchParams(useLocation().search);
  const ticketId = query.get('ticketId');
  const [loading, setLoading] = useState(false);

  // Si pas de ticketId dans l'URL, on redirige vers la liste des tickets
  useEffect(() => {
    if (!ticketId) {
      navigate('/ticket');
    }
  }, [ticketId, navigate]);

  const handlePay = async () => {
    const numericId = Number(ticketId);
    if (Number.isNaN(numericId)) {
      console.error('❌ ticketId invalide');
      return navigate('/ticket');
    }

    setLoading(true);

    try {
      console.log('📤 Demande de démarrage paiement pour ticket :', numericId);
      await startPayment(numericId);

      // Redirection vers la page de confirmation
      navigate(`/pay/confirm?ticketId=${numericId}`);
    } catch (err) {
      console.error('❌ Erreur lors du démarrage du paiement :', err);
      navigate(`/pay/failed?ticketId=${numericId}`);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate(`/ticket/${ticketId}`);
  };

  return (
    <PageLayout title="Paiement" titleClassName="page-title is-centered">
      <div className="card-jo">
        <PaymentForm
          onPay={handlePay}
          onCancel={handleCancel}
          loading={loading}
        />
      </div>
    </PageLayout>
  );
}
