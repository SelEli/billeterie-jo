import { useLocation, Link, useNavigate } from 'react-router-dom';
import PageLayout from '../../common/components/PageLayout';
import { useEffect } from 'react';

export default function PaymentFailed() {
  const navigate = useNavigate();
  const query = new URLSearchParams(useLocation().search);
  const ticketId = query.get('ticketId');

  useEffect(() => {
    if (!ticketId) {
      navigate('/');
    }
  }, [ticketId, navigate]);

  return (
    <PageLayout title="Paiement échoué" titleClassName="page-title is-centered">
      <div className="alert alert-warning mb-2">
        ⚠️ Le paiement pour le ticket <strong>#{ticketId}</strong> a échoué ou a été annulé.
      </div>
      <div className="actions-bar centered gap-md">
        <Link to={`/pay/start?ticketId=${ticketId}`} className="btn btn--primary">
          Réessayer
        </Link>
        <Link to={`/ticket/${ticketId}`} className="btn btn--secondary">
          Retour au ticket
        </Link>
      </div>
    </PageLayout>
  );
}
