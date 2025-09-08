// src/ticketing/pages/TicketForceValidate.jsx
import { useState } from 'react';
import PageLayout from '../../common/components/PageLayout';
import { validateTicket } from '../api/ticket';
import { useAuth } from '../../common/context/AuthContext';

export default function TicketForceValidate() {
  const { user, hasRole } = useAuth();
  const [ticketId, setTicketId] = useState('');
  const [reason, setReason] = useState('');
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  // 🔒 Accès strictement réservé au rôle ADMIN
  if (!user || !hasRole('ADMIN')) {
    return (
      <PageLayout title="Forcer la validation d'un ticket">
        <p>Accès refusé</p>
      </PageLayout>
    );
  }

  const handleValidate = async (e) => {
    e.preventDefault();
    if (!reason.trim()) {
      setError('Veuillez indiquer un motif');
      return;
    }
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const res = await validateTicket(ticketId, { reason });
      setResult(res);
    } catch (err) {
      setError(err.message || 'Erreur lors de la validation');
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageLayout title="Forcer la validation d'un ticket">
      <form onSubmit={handleValidate} className="form-validate-ticket space-y-4">
        <div>
          <label>
            ID du ticket :
            <input
              type="number"
              value={ticketId}
              onChange={(e) => setTicketId(e.target.value)}
              required
            />
          </label>
        </div>
        <div>
          <label>
            Motif :
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Ex: paiement confirmé manuellement"
              required
            />
          </label>
        </div>
        <button type="submit" className="btn btn--primary" disabled={loading}>
          {loading ? 'Validation...' : 'Forcer la validation'}
        </button>
      </form>

      {error && <p className="alert alert--error">{error}</p>}
      {result && (
        <div className="alert alert--success" style={{ marginTop: '1rem' }}>
          <h3>Ticket validé ✅</h3>
          <pre>{JSON.stringify(result, null, 2)}</pre>
        </div>
      )}
    </PageLayout>
  );
}
