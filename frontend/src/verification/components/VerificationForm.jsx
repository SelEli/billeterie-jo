import { useState } from 'react';

export default function VerificationForm({ onVerify, onCancel, loading }) {
  const [showModal, setShowModal] = useState(false);
  const [ticketId, setTicketId] = useState('');
  const [hmac, setHmac] = useState('');

  const handleSubmitMock = (e) => {
    e.preventDefault();
    setShowModal(false);
    onVerify({ ticketId, hmac });
  };

  return (
    <div className="verification-form">
      <p className="verification-text">
        Scannez ou saisissez le QR Code pour vérifier la validité du ticket.
      </p>

      <div className="actions-bar centered">
        <button
          className="btn btn--primary"
          onClick={() => setShowModal(true)}
          disabled={loading}
        >
          {loading ? 'Vérification...' : 'Vérifier un ticket'}
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
            <h3 className="page-title is-centered">Contrôle d’accès</h3>
            <form onSubmit={handleSubmitMock} className="form-container">
              <input
                type="text"
                placeholder="ID du ticket"
                value={ticketId}
                onChange={(e) => setTicketId(e.target.value)}
                required
              />
              <input
                type="text"
                placeholder="HMAC du QR Code"
                value={hmac}
                onChange={(e) => setHmac(e.target.value)}
                required
              />
              <div className="actions-bar centered">
                <button type="submit" className="btn btn--primary">
                  Vérifier
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
