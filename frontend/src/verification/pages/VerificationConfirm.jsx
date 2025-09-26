import { useNavigate, useLocation } from 'react-router-dom';
import PageLayout from '../../common/components/PageLayout';
import { confirmVerification } from '../api/verification';
import { getTicket } from '../../ticketing/api/ticket';
import { useEffect, useState } from 'react';

export default function VerificationConfirm() {
  const navigate = useNavigate();
  const query = new URLSearchParams(useLocation().search);
  const ticketId = query.get('ticketId');
  const [loading, setLoading] = useState(false);
  const [qrPayload, setQrPayload] = useState(null);

  // Charger le ticket complet
  useEffect(() => {
    if (!ticketId || Number.isNaN(Number(ticketId))) {
      navigate('/ticket');
      return;
    }

    getTicket(ticketId, { noCache: true })
      .then(res => {
        const t = res?.data || res;
        if (!t) return navigate('/ticket');

        // Assurer que issuedAt n'est jamais vide
        setQrPayload({
          ticketId: Number(t.id),
          userId: t.userId,
          eventId: t.eventId,
          offerId: t.offerId,
          zone: t.zone,
          price: t.price,
          issuedAt: t.issuedAt || new Date().toISOString(),
          signature: t.signature
        });
      })
      .catch(() => navigate('/ticket'));
  }, [ticketId, navigate]);

  // Confirmer le ticket
  useEffect(() => {
    if (!qrPayload) return;

    const doConfirm = async () => {
      setLoading(true);
      try {
        const res = await confirmVerification(qrPayload);
        if (res?.data?.status !== 'USED') {
          navigate(`/verification/failed?ticketId=${qrPayload.ticketId}`);
        }
      } catch {
        navigate(`/verification/failed?ticketId=${qrPayload.ticketId}`);
      } finally {
        setLoading(false);
      }
    };

    doConfirm();
  }, [qrPayload, navigate]);

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
        <button className="btn btn--primary" onClick={() => navigate(`/ticket/${ticketId}`)}>Voir le ticket</button>
        <button className="btn btn--secondary" onClick={() => navigate('/ticket')}>Retour à mes tickets</button>
      </div>
    </PageLayout>
  );
}
