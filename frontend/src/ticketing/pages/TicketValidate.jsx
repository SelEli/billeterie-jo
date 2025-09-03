import { useState } from 'react';
import PageLayout from '../../common/components/PageLayout';
import { validateTicket } from '../api/ticket';
import { useAuth } from '../../common/context/AuthContext';

export default function TicketValidate() {
  const { user, hasRole } = useAuth();
  const [ticketId, setTicketId] = useState('');
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  // 🔒 Accès strictement réservé au rôle PAYMENT
  if (!user || !hasRole('PAYMENT')) {
    return (
      <PageLayout title="Validation Ticket">
        <p>Accès refusé</p>
      </PageLayout>
    );
  }

  const handleValidate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const res = await validateTicket(ticketId);
      setResult(res);
    } catch (err) {
      setError(err.message || 'Erreur lors de la validation');
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageLayout title="Validation Ticket">
      <form onSubmit={handleValidate} className="form-validate-ticket">
        <label>
          ID du ticket :
          <input
            type="number"
            value={ticketId}
            onChange={(e) => setTicketId(e.target.value)}
            required
          />
        </label>
        <button type="submit" className="btn btn--primary" disabled={loading}>
          {loading ? 'Validation...' : 'Valider le ticket'}
        </button>
      </form>

      {error && <p className="error">{error}</p>}
      {result && (
        <div className="result">
          <h3>Ticket validé ✅</h3>
          <pre>{JSON.stringify(result, null, 2)}</pre>
        </div>
      )}
    </PageLayout>
  );
}
