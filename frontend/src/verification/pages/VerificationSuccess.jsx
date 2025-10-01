import { useNavigate, useLocation } from 'react-router-dom';
import PageLayout from '../../common/components/PageLayout';
import { useEffect } from 'react';

export default function VerificationSuccess() {
  const navigate = useNavigate();
  const query = new URLSearchParams(useLocation().search);
  const ticketId = query.get('ticketId');

  useEffect(() => {
    if (!ticketId || Number.isNaN(Number(ticketId))) navigate('/ticket');
  }, [ticketId, navigate]);

  return (
    <PageLayout title="Vérification réussie" titleClassName="page-title is-centered">
      <div className="alert alert-success mb-2">
        ✅ Le ticket <strong>#{ticketId}</strong> a été vérifié avec succès et marqué comme utilisé.
      </div>
      <div className="actions-bar centered gap-md">
        <button
          className="btn btn--primary"
          onClick={() => navigate(`/ticket/${ticketId}`)}
        >
          Voir le ticket
        </button>
        <button
          className="btn btn--secondary"
          onClick={() => navigate('/ticket')}
        >
          Retour à mes tickets
        </button>
      </div>
    </PageLayout>
  );
}
