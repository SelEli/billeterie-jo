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

export default function VerificationForm({ onVerify, onCancel, loading }) {
  const [form, setForm] = useState({
    ticketId: '',
    eventId: '',
    userId: '',
    zone: '',
    price: '',
    issuedAt: '',
    signature: ''
  });
  const [error, setError] = useState('');

  const handleChange = (field, value) => setForm(prev => ({ ...prev, [field]: value }));

  const onDrop = useCallback((acceptedFiles) => {
    const file = acceptedFiles[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        setError('');
        const qrPayload = await decodeQRCode(e.target.result);
        setForm({
          ticketId: qrPayload.ticketId || '',
          eventId: qrPayload.eventId || '',
          userId: qrPayload.userId || '',
          zone: qrPayload.zone || '',
          price: qrPayload.price || '',
          issuedAt: qrPayload.issuedAt || '',
          signature: qrPayload.signature || ''
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
    const { ticketId, eventId, userId, price, zone, issuedAt, signature } = form;

    if (!ticketId || !eventId || !userId || !price || !zone || !issuedAt || !signature) {
      setError('Veuillez remplir tous les champs (QR ou manuel).');
      return;
    }

    const qrPayload = {
      ticketId: Number(ticketId),
      eventId: Number(eventId),
      userId: Number(userId),
      zone,
      price: Number(price),
      issuedAt,
      signature
    };

    if (
      Number.isNaN(qrPayload.ticketId) ||
      Number.isNaN(qrPayload.eventId) ||
      Number.isNaN(qrPayload.userId) ||
      Number.isNaN(qrPayload.price)
    ) {
      setError('Champs numériques invalides.');
      return;
    }

    onVerify(qrPayload);
  };

  return (
    <div className="verification-form">
      <p className="verification-text">
        Importez un QR code pour préremplir automatiquement les champs, ou saisissez-les manuellement.
      </p>

      {error && <div className="alert alert-warning">{error}</div>}

      <div {...getRootProps()} className="file-drop">
        <input {...getInputProps()} />
        <p>Cliquez ou déposez une image de QR code ici</p>
      </div>

      <form className="form-fields" onSubmit={handleSubmit}>
        <label>
          ID du ticket
          <input type="text" value={form.ticketId} onChange={e => handleChange('ticketId', e.target.value)} />
        </label>
        <label>
          ID de l'événement
          <input type="text" value={form.eventId} onChange={e => handleChange('eventId', e.target.value)} />
        </label>
        <label>
          ID utilisateur
          <input type="text" value={form.userId} onChange={e => handleChange('userId', e.target.value)} />
        </label>
        <label>
          Zone
          <input type="text" value={form.zone} onChange={e => handleChange('zone', e.target.value)} />
        </label>
        <label>
          Prix
          <input type="number" value={form.price} onChange={e => handleChange('price', e.target.value)} />
        </label>
        <label>
          Date émission (ISO)
          <input type="text" value={form.issuedAt} onChange={e => handleChange('issuedAt', e.target.value)} />
        </label>
        <label>
          Signature HMAC
          <input type="text" value={form.signature} onChange={e => handleChange('signature', e.target.value)} />
        </label>

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
