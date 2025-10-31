import { useEffect, useState } from 'react';
import { getStats } from '../api/stats';
import { useNavigate } from 'react-router-dom';

export default function StatsPage() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    getStats()
      .then(res => setStats(res.data || res))
      .catch(err => console.error('Erreur stats:', err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p>Chargement…</p>;
  if (!stats) return <p>Aucune statistique disponible</p>;

  return (
    <div className="ticket-detail-container">
      {/* Actions haut */}
      <div className="ticket-actions-top">
        <button
          className="btn btn--secondary"
          onClick={() => navigate('/')}
        >
          ← Retour à l’accueil
        </button>
      </div>

      {/* Carte stats */}
      <div className="ticket-card print-area">
        <div className="ticket-banner">📊 Statistiques globales</div>

        <div className="ticket-content">
          <h2 className="ticket-title">Résumé des ventes</h2>

          <h3>Tickets par événement</h3>
          <ul>
            {stats.events.map((e, i) => (
              <li key={i}>
                {e.event} : {e.ventes}
              </li>
            ))}
          </ul>

          <h3>Tickets par offre</h3>
          <ul>
            {stats.offers.map((o, i) => (
              <li key={i}>
                {o.offer} : {o.ventes}
              </li>
            ))}
          </ul>

          <h3>Total</h3>
          <p>{stats.totalTickets} tickets</p>
        </div>
      </div>
    </div>
  );
}
