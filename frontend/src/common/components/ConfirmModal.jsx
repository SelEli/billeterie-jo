import React from 'react';
import ReactDOM from 'react-dom';
import '../../styles/components.scss'; // pour s'assurer que les styles globaux sont là

export default function ConfirmModal({ title, message, onConfirm, onCancel }) {
  return ReactDOM.createPortal(
    <div className="modal-overlay">
      <div className="modal glass">
        <h3 className="modal__title">{title}</h3>
        <p className="modal__message">{message}</p>
        <div className="modal__actions">
          <button className="btn btn--danger" onClick={onConfirm}>
            Confirmer
          </button>
          <button className="btn btn--secondary" onClick={onCancel}>
            Annuler
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
