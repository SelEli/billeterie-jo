import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PageLayout from '../../common/components/PageLayout';
import { getStats } from '../api/stats';
import { useAuth } from '../../common/context/AuthContext';

export default function StatsPage() {
  const navigate = useNavigate();
  const { user, loading, hasRole } = useAuth();
  const [stats, setStats] = useState(null);
  const [loadingStats, setLoadingStats] = useState(true);

  useEffect(() => {
    getStats()
      .then((res) => setStats(res.data || res))
      .catch((err) => console.error('Erreur stats:', err))
      .finally(() => setLoadingStats(false));
  }, []);

  if (loading || loadingStats) {
    return (
      <PageLayout title="Statistiques">
        <p>Chargement...</p>
      </PageLayout>
    );
  }

  if (!stats) {
    return (
      <PageLayout title="Statistiques">
        <p>Aucune donnée disponible.</p>
      </PageLayout>
    );
  }

  return (
    <PageLayout title="Statistiques globales">
      {/* Barre d’actions */}
      <div className="actions-bar" style={{ marginBottom: '1rem' }}>
        {user && hasRole('ADMIN') && (
          <button
            className="btn btn--secondary"
            onClick={() => navigate('/')}
          >
            ← Retour à l’accueil
          </button>
        )}
      </div>

      {/* Résumé global */}
      <div className="ticket-card print-area">
        <div className="ticket-banner">📊 Résumé des ventes</div>

        <div className="ticket-content">
          <h2 className="ticket-title">Tickets par événement</h2>
          <ul className="stats-list">
            {stats.events.map((e, i) => (
              <li key={i}>
                <strong>{e.event}</strong> : {e.ventes}
              </li>
            ))}
          </ul>

          <h2 className="ticket-title">Tickets par offre</h2>
          <ul className="stats-list">
            {stats.offers.map((o, i) => (
              <li key={i}>
                <strong>{o.offer}</strong> : {o.ventes}
              </li>
            ))}
          </ul>

          <h2 className="ticket-title">Total</h2>
          <p className="stats-total">{stats.totalTickets} tickets vendus</p>
        </div>
      </div>
    </PageLayout>
  );
}
