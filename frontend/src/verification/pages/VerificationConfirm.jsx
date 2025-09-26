import { useLocation, Link, useNavigate } from 'react-router-dom';
import PageLayout from '../../common/components/PageLayout';
import { useEffect, useState } from 'react';
import { confirmVerification } from '../api/verification';

export default function VerificationConfirm() {
  const navigate = useNavigate();
  const query = new URLSearchParams(useLocation().search);
  const ticketId = query.get('ticketId');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!ticketId || Number.isNaN(Number(ticketId))) navigate('/ticket');
  }, [ticketId, navigate]);

  useEffect(() => {
    const doConfirm = async () => {
      const numericId = Number(ticketId);
      if (!numericId) return;

      setLoading(true);
      try {
        const res = await confirmVerification({ ticketId: numericId });
        if (res?.data?.status === 'USED') {
          // succès → on reste ici
        } else {
          navigate(`/verification/failed?ticketId=${numericId}`);
        }
      } catch {
        navigate(`/verification/failed?ticketId=${numericId}`);
      } finally {
        setLoading(false);
      }
    };
    doConfirm();
  }, [ticketId, navigate]);

  return (
    <PageLayout title="Vérification réussie" titleClassName="page-title is-centered">
      {loading ? (
        <div className="alert alert-info mb-2">⏳ Validation en cours…</div>
      ) : (
        <div className="alert alert-success mb-2">
          ✅ Le ticket <strong>#{ticketId}</strong> a été vérifié avec succès et marqué comme utilisé.
        </div>
      )}

      <div className="actions-bar centered gap-md">
        <Link to={`/ticket/${ticketId}`} className="btn btn--primary">Voir le ticket</Link>
        <Link to="/ticket" className="btn btn--secondary">Retour à mes tickets</Link>
      </div>
    </PageLayout>
  );
}
