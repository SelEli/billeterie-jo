import { useNavigate, useLocation } from 'react-router-dom';
import PageLayout from '../../common/components/PageLayout';
import PaymentForm from '../components/PaymentForm';
import { confirmPayment } from '../api/payment';
import { useState } from 'react';

export default function PaymentStart() {
  const navigate = useNavigate();
  const query = new URLSearchParams(useLocation().search);
  const ticketId = query.get('ticketId');
  const [loading, setLoading] = useState(false);

  const handlePay = async () => {
    setLoading(true);
    try {
      await confirmPayment(ticketId);
      navigate(`/payment/confirm?ticketId=${ticketId}`);
    } catch {
      navigate(`/payment/failed?ticketId=${ticketId}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageLayout title="Paiement" titleClassName="page-title is-centered">
      <div className="card-jo">
        <PaymentForm
          onPay={handlePay}
          onCancel={() => navigate(`/ticket/${ticketId}`)}
          loading={loading}
        />
      </div>
    </PageLayout>
  );
}
