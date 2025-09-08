import { useLocation, Link } from 'react-router-dom';
import PageLayout from '../../common/components/PageLayout';

export default function PaymentConfirm() {
  const query = new URLSearchParams(useLocation().search);
  const ticketId = query.get('ticketId');

  return (
    <PageLayout title="Paiement réussi" titleClassName="page-title is-centered">
      <div className="alert alert-success" style={{ marginBottom: '1.5rem' }}>
        ✅ Votre ticket <strong>#{ticketId}</strong> a été validé avec succès.
      </div>
      <div className="actions-bar" style={{ justifyContent: 'center' }}>
        <Link to={`/ticket/${ticketId}`} className="btn btn--primary">
          Voir le ticket
        </Link>
      </div>
    </PageLayout>
  );
}
