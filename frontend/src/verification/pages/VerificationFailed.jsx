// src/verification/pages/VerificationFailed.jsx
import { useLocation, Link, useNavigate } from 'react-router-dom';
import PageLayout from '../../common/components/PageLayout';
import { useEffect } from 'react';

export default function VerificationFailed() {
  const navigate = useNavigate();
  const query = new URLSearchParams(useLocation().search);
  const ticketId = query.get('ticketId');

  useEffect(() => {
    if (!ticketId) {
      navigate('/');
    }
  }, [ticketId, navigate]);

  return (
    <PageLayout title="Vérification échouée" titleClassName="page-title is-centered">
      <div className="alert alert-danger" style={{ marginBottom: '1.5rem' }}>
        ❌ Le ticket <strong>#{ticketId}</strong> est invalide ou n’a pas pu être vérifié.
      </div>
      <div className="actions-bar" style={{ justifyContent: 'center', gap: '1rem' }}>
        <Link to={`/verification/start?ticketId=${ticketId}`} className="btn btn--primary">
          Réessayer
        </Link>
        <Link to="/ticket" className="btn btn--secondary">
          Retour à mes tickets
        </Link>
      </div>
    </PageLayout>
  );
}
