// src/verification/pages/VerificationStart.jsx
import { useNavigate, useLocation } from 'react-router-dom';
import PageLayout from '../../common/components/PageLayout';
import VerificationForm from '../components/VerificationForm';
import { verifyTicket, forceValidateTicket } from '../api/verification';
import { getTicket } from '../../ticketing/api/ticket';
import { useState, useEffect } from 'react';
import { useAuth } from '../../common/context/AuthContext';

export default function VerificationStart() {
  const navigate = useNavigate();
  const query = new URLSearchParams(useLocation().search);
  const ticketId = query.get('ticketId');
  const [loading, setLoading] = useState(false);
  const [ticket, setTicket] = useState(null);
  const { hasRole } = useAuth();

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
      const res = await verifyTicket({ ticketId: numericId, hmac });
      if (res?.data?.status === 'VALID') {
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

  const handleForce = async () => {
    const numericId = Number(ticketId);
    if (Number.isNaN(numericId)) return navigate('/ticket');
    setLoading(true);
    try {
      await forceValidateTicket(numericId);
      navigate(`/verification/confirm?ticketId=${numericId}&forced=1`);
    } catch {
      navigate(`/verification/failed?ticketId=${numericId}`);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => navigate(`/ticket/${ticketId}`);

  return (
    <PageLayout title="Vérification QR Code" titleClassName="page-title is-centered">
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
        <VerificationForm onVerify={handleVerify} onCancel={handleCancel} loading={loading} />

        {/* Option réservée aux rôles habilités */}
        {hasRole(['ADMIN', 'EMPLOYEE', 'AGENT']) && (
          <div className="actions-bar centered mt-4">
            <button
              className="btn btn--warning"
              onClick={handleForce}
              disabled={loading}
            >
              Forcer la validation
            </button>
          </div>
        )}
      </div>
    </PageLayout>
  );
}
