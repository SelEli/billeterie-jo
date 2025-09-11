import { useState } from 'react';

export default function PaymentForm({ onPay, onCancel, loading }) {
  const [showModal, setShowModal] = useState(false);

  const handleSubmitMock = (e) => {
    e.preventDefault();
    setShowModal(false);
    onPay();
  };

  return (
    <div className="payment-form">
      <p className="payment-text">Procédez au paiement pour valider votre ticket.</p>

      <div className="actions-bar centered">
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

      {showModal && (
        <div className="modal-overlay">
          <div className="card-jo modal-card">
            <h3 className="page-title is-centered">Paiement sécurisé</h3>
            <form onSubmit={handleSubmitMock} className="form-container">
              <input type="text" placeholder="Numéro de carte" required />
              <input type="text" placeholder="MM/AA" required />
              <input type="text" placeholder="CVC" required />
              <div className="actions-bar centered">
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
