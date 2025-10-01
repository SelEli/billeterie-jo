import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import jsQR from 'jsqr';

async function decodeQRCode(dataUrl) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0);
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const qr = jsQR(imageData.data, canvas.width, canvas.height);
      if (qr) {
        try {
          resolve(JSON.parse(qr.data));
        } catch {
          reject(new Error('QR code invalide (JSON attendu).'));
        }
      } else {
        reject(new Error('Aucun QR code détecté.'));
      }
    };
    img.onerror = () => reject(new Error('Image non lisible.'));
    img.src = dataUrl;
  });
}

export default function StartVerificationForm({ onVerify, onCancel, loading }) {
  const [form, setForm] = useState({
    ticketId: '',
    userId: '',
    signature: '',
    status: '' // statut vide, sera rempli uniquement si QR contient la valeur
  });

  const [error, setError] = useState('');

  const handleChange = (field, value) =>
    setForm(prev => ({ ...prev, [field]: value }));

  const onDrop = useCallback((acceptedFiles) => {
    const file = acceptedFiles[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        setError('');
        const qrPayload = await decodeQRCode(e.target.result);

        setForm({
          ticketId: qrPayload.ticketId ?? '',
          userId: qrPayload.userId ?? '',
          signature: qrPayload.signature ?? '',
          status: qrPayload.status ?? '' // ne rien forcer, juste récupérer si présent
        });
      } catch (err) {
        setError(err.message);
      }
    };
    reader.readAsDataURL(file);
  }, []);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: { 'image/*': ['.png', '.jpg', '.jpeg'] }
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const { ticketId, userId, signature, status } = form;

    if (!ticketId || !userId || !signature) {
      setError('Veuillez remplir tous les champs requis (QR ou manuel).');
      return;
    }

    const payload = {
      ticketId: Number(ticketId),
      userId: Number(userId),
      signature
    };

    if (status) {
      payload.status = status; // n'ajoute status que s'il existe
    }

    if ([payload.ticketId, payload.userId].some(Number.isNaN)) {
      setError('Champs numériques invalides.');
      return;
    }

    onVerify(payload);
  };

  return (
    <div className="verification-form">
      <p className="verification-text">
        Importez un QR code pour préremplir les champs requis ou saisissez-les manuellement.
      </p>

      {error && <div className="alert alert-warning">{error}</div>}

      <div {...getRootProps()} className="file-drop">
        <input {...getInputProps()} />
        <p>Cliquez ou déposez une image de QR code ici</p>
      </div>

      <form className="form-fields" onSubmit={handleSubmit}>
        <label>ID du ticket<input type="text" value={form.ticketId} onChange={e => handleChange('ticketId', e.target.value)} /></label>
        <label>ID utilisateur<input type="text" value={form.userId} onChange={e => handleChange('userId', e.target.value)} /></label>
        <label>Signature HMAC<input type="text" value={form.signature} onChange={e => handleChange('signature', e.target.value)} /></label>

        <div className="actions-bar">
          <button type="submit" className="btn btn--primary" disabled={loading}>
            {loading ? 'Vérification…' : 'Vérifier'}
          </button>
          <button type="button" className="btn btn--secondary" onClick={onCancel} disabled={loading}>
            Annuler
          </button>
        </div>
      </form>
    </div>
  );
}
