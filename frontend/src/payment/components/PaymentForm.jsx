import { useState } from 'react';

export default function PaymentForm({ onPay, onCancel, loading }) {
  const [showModal, setShowModal] = useState(false);

  const handleSubmitMock = (e) => {
    e.preventDefault();
    setShowModal(false);
    onPay(); // déclenche confirmPayment côté front
  };

  return (
    <div style={{ textAlign: 'center' }}>
      <p>Procédez au paiement pour valider votre ticket.</p>

      {/* Boutons principaux */}
      <div className="actions-bar" style={{ justifyContent: 'center' }}>
        <button
          className="btn btn--primary"
          onClick={() => setShowModal(true)}
          disabled={loading}
        >
          {loading ? 'Paiement...' : 'Payer maintenant'}
        </button>
        <button
          className="btn btn--secondary"
          onClick={onCancel}
          disabled={loading}
        >
          Annuler
        </button>
      </div>

      {/* Fenêtre modale de paiement mock */}
      {showModal && (
        <div
          className="modal glass"
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000
          }}
        >
          <div
            className="card-jo"
            style={{
              maxWidth: '400px',
              width: '100%',
              textAlign: 'center'
            }}
          >
            <h3 className="page-title is-centered">Paiement sécurisé</h3>
            <form onSubmit={handleSubmitMock} className="form-container">
              <input type="text" placeholder="Numéro de carte" required />
              <input type="text" placeholder="MM/AA" required />
              <input type="text" placeholder="CVC" required />
              <div className="actions-bar" style={{ justifyContent: 'center' }}>
                <button type="submit" className="btn btn--primary">
                  Valider le paiement
                </button>
                <button
                  type="button"
                  className="btn btn--secondary"
                  onClick={() => setShowModal(false)}
                >
                  Annuler
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
