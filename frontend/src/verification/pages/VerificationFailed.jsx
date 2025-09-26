import { useLocation, Link, useNavigate } from 'react-router-dom';
import PageLayout from '../../common/components/PageLayout';
import { useEffect } from 'react';

export default function VerificationFailed() {
  const navigate = useNavigate();
  const query = new URLSearchParams(useLocation().search);
  const ticketId = query.get('ticketId');

  useEffect(() => {
    if (!ticketId || Number.isNaN(Number(ticketId))) navigate('/ticket');
  }, [ticketId, navigate]);

  return (
    <PageLayout title="Vérification échouée" titleClassName="page-title is-centered">
      <div className="alert alert-warning mb-2">
        ⚠️ La vérification du ticket <strong>#{ticketId}</strong> a échoué.  
        Seuls les tickets avec statut <code>VALID</code> peuvent être vérifiés,  
        et ils passent ensuite en <code>USED</code>.
      </div>
      <div className="actions-bar centered gap-md">
        <Link to={`/verification/start?ticketId=${ticketId}`} className="btn btn--primary">Réessayer</Link>
        <Link to={`/ticket/${ticketId}`} className="btn btn--secondary">Retour au ticket</Link>
      </div>
    </PageLayout>
  );
}
