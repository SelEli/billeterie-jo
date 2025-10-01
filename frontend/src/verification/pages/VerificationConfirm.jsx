import { useNavigate, useLocation } from 'react-router-dom';
import PageLayout from '../../common/components/PageLayout';
import { useEffect, useState } from 'react';
import { confirmVerification } from '../api/verification'; // Appel back polling

export default function VerificationConfirm() {
  const navigate = useNavigate();
  const query = new URLSearchParams(useLocation().search);
  const ticketId = query.get('ticketId');

  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState(null);

  useEffect(() => {
    if (!ticketId) {
      navigate('/ticket');
      return;
    }

    let interval;
    const pollStatus = async () => {
      try {
        const res = await confirmVerification({ ticketId });
        const currentStatus = res?.status;

        if (currentStatus === 'USED') {
          clearInterval(interval);
          setStatus('USED');
          setLoading(false);
          // Redirige vers page Success après court délai pour afficher message
          setTimeout(() => navigate(`/verification/success?ticketId=${ticketId}`), 1000);
        } else {
          // Si le ticket n'est pas encore USED, continue le polling
          console.log(`[Polling] ticket ${ticketId} status: ${currentStatus}`);
        }
      } catch (err) {
        console.error('Erreur lors de la vérification du ticket:', err);
        clearInterval(interval);
        setStatus('FAILED');
        setLoading(false);
        // Redirige vers page Failed
        setTimeout(() => navigate(`/verification/failed?ticketId=${ticketId}`), 1000);
      }
    };

    pollStatus();
    interval = setInterval(pollStatus, 2000); // toutes les 2 secondes

    return () => clearInterval(interval);
  }, [ticketId, navigate]);

  return (
    <PageLayout title="Vérification en cours" titleClassName="page-title is-centered">
      {loading ? (
        <div className="alert alert-info mb-2">⏳ Vérification du ticket <strong>#{ticketId}</strong>…</div>
      ) : status === 'USED' ? (
        <div className="alert alert-success mb-2">
          ✅ Le ticket <strong>#{ticketId}</strong> a été vérifié avec succès !
        </div>
      ) : (
        <div className="alert alert-danger mb-2">
          ❌ Le ticket <strong>#{ticketId}</strong> est invalide ou déjà utilisé.
        </div>
      )}
    </PageLayout>
  );
}
