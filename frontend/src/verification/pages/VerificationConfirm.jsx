import { useNavigate, useLocation, Link } from 'react-router-dom';
import PageLayout from '../../common/components/PageLayout';
import { useEffect } from 'react';

export default function VerificationConfirm() {
  const navigate = useNavigate();
  const query = new URLSearchParams(useLocation().search);
  const ticketId = query.get('ticketId');

  useEffect(() => {
    if (!ticketId || Number.isNaN(Number(ticketId))) navigate('/ticket');
  }, [ticketId, navigate]);

  return (
    <PageLayout title="Vérification réussie" titleClassName="page-title is-centered">
      <div className="alert alert-success mb-2">
        ✅ Le ticket <strong>#{ticketId}</strong> a été vérifié et marqué comme <code>USED</code>.
      </div>
      <div className="actions-bar centered gap-md">
        <Link to={`/ticket/${ticketId}`} className="btn btn--primary">Voir le ticket</Link>
        <Link to="/ticket" className="btn btn--secondary">Retour à la liste</Link>
      </div>
    </PageLayout>
  );
}
