// src/verification/pages/VerificationStart.jsx
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
    } else {
      getTicket(ticketId, { noCache: true })
        .then(res => setTicket(res?.data || res))
        .catch(() => navigate('/ticket'));
    }
  }, [ticketId, navigate]);

  const handleVerify = async ({ ticketId: formId, hmac }) => {
    const numericId = Number(formId || ticketId);
    if (Number.isNaN(numericId)) return navigate('/ticket');
    setLoading(true);
    try {
      await startVerification(numericId, hmac);
      navigate(`/verification/confirm?ticketId=${numericId}`);
    } catch {
      navigate(`/verification/failed?ticketId=${numericId}`);
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
            <p><strong>Événement :</strong> {ticket.event?.label || '—'}</p>
            <p><strong>Date :</strong> {ticket.event?.date ? new Date(ticket.event.date).toLocaleDateString() : '—'}</p>
            <p><strong>Zone :</strong> {ticket.zone}</p>
          </div>
        )}

        {/* Formulaire affiché pour tout le monde */}
        <VerificationForm
          onVerify={handleVerify}
          onCancel={handleCancel}
          loading={loading}
        />
      </div>
    </PageLayout>
  );
}
