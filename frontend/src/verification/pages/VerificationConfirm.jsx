// src/verification/pages/VerificationConfirm.jsx
import { useLocation, Link, useNavigate } from 'react-router-dom';
import PageLayout from '../../common/components/PageLayout';
import { useEffect, useState } from 'react';
import { confirmVerification } from '../api/verification';

export default function VerificationConfirm() {
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

  // Étape 2 : confirmer la vérification
  useEffect(() => {
    const doConfirm = async () => {
      const numericId = Number(ticketId);
      if (!numericId) return;

      setLoading(true);
      try {
        console.log('📤 Appel de /verification/confirm pour valider le ticket…');
        const res = await confirmVerification(numericId);

        // On n'accepte que VALID comme succès
        if (res?.data?.status !== 'VALID') {
          await new Promise(r => setTimeout(r, 1000)); // attendre 1 seconde
          navigate(`/verification/failed?ticketId=${numericId}`);
        }
      } catch (err) {
        console.error('❌ Erreur lors de la confirmation de la vérification :', err);
        navigate(`/verification/failed?ticketId=${numericId}`);
      } finally {
        setLoading(false);
      }
    };

    doConfirm();
  }, [ticketId, navigate]);

  return (
    <PageLayout title="Vérification réussie" titleClassName="page-title is-centered">
      {loading ? (
        <div className="alert alert-info mb-2">
          ⏳ Validation en cours…
        </div>
      ) : (
        <div className="alert alert-success mb-2">
          ✅ Le ticket <strong>#{ticketId}</strong> a été vérifié avec succès.
        </div>
      )}

      <div className="actions-bar centered gap-md">
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
