const QRCode = require('qrcode');
const { getBilletParCleAchat } = require('../models/billet.model');

const genererQRCodePourCle = async (req, res) => {
  try {
    const { cle_achat } = req.params;

    if (!cle_achat || typeof cle_achat !== 'string' || cle_achat.trim() === '') {
      console.warn('[QR CONTROLLER] Clé absente ou invalide :', cle_achat);
      return res.status(400).json({ message: 'Clé d’achat invalide ou vide.' });
    }

    const cleNettoyee = cle_achat.trim();
    const billet = getBilletParCleAchat(cleNettoyee);

    if (!billet) {
      console.warn('[QR CONTROLLER] Aucun billet trouvé pour cette clé :', cleNettoyee);
      return res.status(404).json({ message: 'Billet introuvable pour cette clé.' });
    }

    const contenuQRCode = billet.cle_invisible && billet.cle_achat
      ? `${billet.cle_invisible}:${billet.cle_achat}`
      : billet.cle_achat;

    const qrCodeBuffer = await QRCode.toBuffer(contenuQRCode, { type: 'png' });

    res.setHeader('Content-Type', 'image/png');
    res.status(200).send(qrCodeBuffer);
  } catch (error) {
    console.error('[QR CONTROLLER][ERREUR]', error.message);
    res.status(500).json({ message: 'Erreur lors de la génération du QR code.' });
  }
};

module.exports = { genererQRCodePourCle };
