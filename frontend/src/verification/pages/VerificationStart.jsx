import { useNavigate, useLocation } from 'react-router-dom';
import PageLayout from '../../common/components/PageLayout';
import VerificationForm from '../components/VerificationForm';
import { verifyTicketDirect } from '../api/verification'; // nouveau helper direct vers /verify
import { getTicket } from '../../ticketing/api/ticket';
import { useState, useEffect } from 'react';

export default function VerificationStart() {
  const navigate = useNavigate();
  const query = new URLSearchParams(useLocation().search);
  const ticketId = query.get('ticketId');
  const [loading, setLoading] = useState(false);
  const [ticket, setTicket] = useState(null);

  useEffect(() => {
    if (!ticketId) return navigate('/ticket');
    getTicket(ticketId, { noCache: true })
      .then(res => setTicket(res?.data || res))
      .catch(() => navigate('/ticket'));
  }, [ticketId, navigate]);

  const handleVerify = async (qrPayload) => {
    const numericId = Number(qrPayload.ticketId || ticketId);
    if (Number.isNaN(numericId)) return navigate('/ticket');
    
    setLoading(true);
    try {
      const res = await verifyTicketDirect(qrPayload); // appel direct /verify
      const status = res?.status || res?.data?.status;

      if (status === 'USED') {
        navigate(`/verification/confirm?ticketId=${numericId}`);
      } else {
        navigate(`/verification/failed?ticketId=${numericId}`);
      }
    } catch {
      navigate(`/verification/failed?ticketId=${numericId}`);
    } finally {
      setLoading(false);
    }
  };

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
          onCancel={() => navigate(`/ticket/${ticketId}`)}
          loading={loading}
        />
      </div>
    </PageLayout>
  );
}
