import { useLocation, Link } from 'react-router-dom';
import PageLayout from '../../common/components/PageLayout';

export default function PaymentFailed() {
  const query = new URLSearchParams(useLocation().search);
  const ticketId = query.get('ticketId');

  return (
    <PageLayout title="Paiement échoué" titleClassName="page-title is-centered">
      <div className="alert alert-warning" style={{ marginBottom: '1.5rem' }}>
        ⚠️ Le paiement pour le ticket <strong>#{ticketId}</strong> a échoué ou a été annulé.
      </div>
      <div className="actions-bar" style={{ justifyContent: 'center' }}>
        <Link to={`/payment/start?ticketId=${ticketId}`} className="btn btn--primary">
          Réessayer
        </Link>
        <Link to={`/ticket/${ticketId}`} className="btn btn--secondary">
          Retour au ticket
        </Link>
      </div>
    </PageLayout>
  );
}
