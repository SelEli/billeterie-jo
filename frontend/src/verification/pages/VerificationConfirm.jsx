// src/verification/pages/VerificationConfirm.jsx
import { useLocation, Link, useNavigate } from 'react-router-dom';
import PageLayout from '../../common/components/PageLayout';
import { useEffect, useState } from 'react';

export default function VerificationConfirm() {
  const navigate = useNavigate();
  const query = new URLSearchParams(useLocation().search);
  const ticketId = query.get('ticketId');
  const forced = query.get('forced') === '1';
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!ticketId || Number.isNaN(Number(ticketId))) {
      navigate('/ticket');
    } else {
      // Simule un petit délai de confirmation
      setTimeout(() => setLoading(false), 800);
    }
  }, [ticketId, navigate]);

  return (
    <PageLayout title="Vérification confirmée" titleClassName="page-title is-centered">
      {loading ? (
        <div className="alert alert-info" style={{ marginBottom: '1.5rem' }}>
          ⏳ Confirmation en cours…
        </div>
      ) : (
        <div className={`alert ${forced ? 'alert-warning' : 'alert-success'}`} style={{ marginBottom: '1.5rem' }}>
          {forced ? (
            <>⚠️ Le ticket <strong>#{ticketId}</strong> a été validé par un agent habilité (validation forcée).</>
          ) : (
            <>✅ Le ticket <strong>#{ticketId}</strong> est valide et l’accès est autorisé.</>
          )}
        </div>
      )}
      <div className="actions-bar" style={{ justifyContent: 'center', gap: '1rem' }}>
        <Link to={`/ticket/${ticketId}`} className="btn btn--primary">
          Voir le ticket
        </Link>
        <Link to="/ticket" className="btn btn--secondary">
          Retour à mes tickets
        </Link>
      </div>
    </PageLayout>
  );
}
