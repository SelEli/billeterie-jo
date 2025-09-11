import { useLocation, Link, useNavigate } from 'react-router-dom';
import PageLayout from '../../common/components/PageLayout';
import { useEffect, useState } from 'react';
import { confirmPayment } from '../api/payment';

export default function PaymentConfirm() {
  const navigate = useNavigate();
  const query = new URLSearchParams(useLocation().search);
  const ticketId = query.get('ticketId');
  const [loading, setLoading] = useState(false);

  // Redirection si pas de ticketId valide
  useEffect(() => {
    if (!ticketId || Number.isNaN(Number(ticketId))) {
      navigate('/ticket');
    }
  }, [ticketId, navigate]);

  // Étape 2 : confirmer le paiement
  useEffect(() => {
    const doConfirm = async () => {
      const numericId = Number(ticketId);
      if (!numericId) return;

      setLoading(true);
      try {
        console.log('📤 Appel de /payment/confirm pour valider le ticket…');
        const res = await confirmPayment(numericId);

        // Si pas VALID tout de suite, on attend un court instant avant de juger
        if (res?.data?.status !== 'VALID') {
          await new Promise(r => setTimeout(r, 1000)); // attendre 1 seconde
        }

        if (res?.data?.status !== 'VALID') {
          navigate(`/pay/failed?ticketId=${numericId}`);
        }
      } catch (err) {
        console.error('❌ Erreur lors de la confirmation du paiement :', err);
        navigate(`/pay/failed?ticketId=${numericId}`);
      } finally {
        setLoading(false);
      }
    };

    doConfirm();
  }, [ticketId, navigate]);

  return (
    <PageLayout title="Paiement réussi" titleClassName="page-title is-centered">
      {loading ? (
        <div className="alert alert-info" style={{ marginBottom: '1.5rem' }}>
          ⏳ Validation en cours…
        </div>
      ) : (
        <div className="alert alert-success" style={{ marginBottom: '1.5rem' }}>
          ✅ Votre ticket <strong>#{ticketId}</strong> a été validé avec succès.
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
