import { useNavigate, useLocation } from 'react-router-dom';
import PageLayout from '../../common/components/PageLayout';
import VerificationForm from '../components/VerificationForm';
import { startVerification } from '../api/verification';
import { getTicket } from '../../ticketing/api/ticket';
import { useState, useEffect } from 'react';

export default function VerificationStart() {
  const navigate = useNavigate();
  const query = new URLSearchParams(useLocation().search);
  const ticketId = query.get('ticketId');
  const [loading, setLoading] = useState(false);
  const [ticket, setTicket] = useState(null);

  useEffect(() => {
    if (!ticketId) {
      navigate('/ticket');
      return;
    }

    getTicket(ticketId, { noCache: true })
      .then(res => setTicket(res?.data || res))
      .catch(() => navigate('/ticket'));
  }, [ticketId, navigate]);

  const handleVerify = async (qrPayload) => {
    // 🔹 strict : ne pas remplacer ticketId par défaut
    if (!qrPayload.ticketId || !qrPayload.userId || !qrPayload.signature) {
      return navigate(`/verification/failed?ticketId=${ticketId}`);
    }

    const numericTicketId = Number(qrPayload.ticketId);
    const numericUserId = Number(qrPayload.userId);

    if ([numericTicketId, numericUserId].some(Number.isNaN)) {
      return navigate(`/verification/failed?ticketId=${ticketId}`);
    }

    const payload = {
      ticketId: numericTicketId,
      userId: numericUserId,
      signature: qrPayload.signature,
      ...(qrPayload.status !== undefined && { status: qrPayload.status }) // 🔹 uniquement si présent
    };

    setLoading(true);
    try {
      const res = await startVerification(payload);
      // START verification : VALID -> USED seulement si signature ok
      if (res?.data?.status === 'USED') {
        navigate(`/verification/confirm?ticketId=${numericTicketId}`);
      } else {
        navigate(`/verification/failed?ticketId=${numericTicketId}`);
      }
    } catch {
      navigate(`/verification/failed?ticketId=${numericTicketId}`);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => navigate(`/ticket/${ticketId}`);

  return (
    <PageLayout title="Vérification" titleClassName="page-title is-centered">
      <div className="card-jo">
        {ticket && (
          <div className="verification-summary mb-4">
            <h2>Détails du ticket</h2>
            <p><strong>Numéro :</strong> {ticket.id}</p>
            <p><strong>Status :</strong> {ticket.status}</p>
          </div>
        )}

        <VerificationForm
          onVerify={handleVerify}
          onCancel={handleCancel}
          loading={loading}
        />
      </div>
    </PageLayout>
  );
}
