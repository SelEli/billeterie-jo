const express = require('express');
const router = express.Router();

const verifyToken = require('../middlewares/auth.middleware');
const verifyRole = require('../middlewares/role.middleware');

const { getTousLesBillets, getBilletParCle } = require('../models/billet.model');
const { getTousLesPaiements } = require('../models/paiement.model');

const QRCode = require('qrcode');
const { Parser } = require('json2csv');

//
// Routes utilisateur connecté
//

router.get('/utilisateur/mes-billets', verifyToken, (req, res) => {
  const utilisateurId = req.user.utilisateurId;
  const billetsUtilisateur = getTousLesBillets().filter(
    (b) => b.id_utilisateur === utilisateurId
  );
  res.status(200).json({ billets: billetsUtilisateur });
});

router.get('/utilisateur/mes-paiements', verifyToken, (req, res) => {
  const utilisateurId = req.user.utilisateurId;
  const paiementsUtilisateur = getTousLesPaiements().filter(
    (p) => p.id_utilisateur === utilisateurId
  );
  res.status(200).json({ paiements: paiementsUtilisateur });
});

//
// Export CSV — ADMIN
//

router.get('/admin/export', verifyToken, verifyRole(['admin']), (req, res) => {
  res.status(200).json({ message: "Bienvenue dans l'espace admin." });
});

router.get('/admin/export/csv', verifyToken, verifyRole(['admin']), (req, res) => {
  try {
    const billets = getTousLesBillets();

    if (!billets || billets.length === 0) {
      return res.status(204).json({ message: 'Aucun billet à exporter.' });
    }

    const champs = ['id', 'id_utilisateur', 'id_evenement', 'statut'];
    const parser = new Parser({ fields: champs });
    const csv = parser.parse(billets);

    const dateExport = new Date().toISOString().split('T')[0];
    const nomFichier = `export-billets-${dateExport}.csv`;

    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', `attachment; filename="${nomFichier}"`);
    res.status(200).send(csv);
  } catch (error) {
    console.error('[EXPORT][Billets]', error.message);
    res.status(500).json({ message: "Erreur lors de l'export CSV des billets." });
  }
});

router.get('/admin/export/paiements', verifyToken, verifyRole(['admin']), (req, res) => {
  try {
    const paiements = getTousLesPaiements();

    if (!paiements || paiements.length === 0) {
      return res.status(204).json({ message: 'Aucun paiement à exporter.' });
    }

    const champs = ['id', 'id_utilisateur', 'montant', 'methode', 'date'];
    const parser = new Parser({ fields: champs });
    const csv = parser.parse(paiements);

    const dateExport = new Date().toISOString().split('T')[0];
    const nomFichier = `export-paiements-${dateExport}.csv`;

    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', `attachment; filename="${nomFichier}"`);
    res.status(200).send(csv);
  } catch (error) {
    console.error('[EXPORT][Paiements]', error.message);
    res.status(500).json({ message: "Erreur lors de l'export CSV des paiements." });
  }
});

//
// QR code par cle_achat
//

// Version base64
router.get('/qr/:cle_achat', verifyToken, async (req, res) => {
  const { cle_achat } = req.params;
  const billet = getBilletParCle(cle_achat);

  if (!billet) {
    return res.status(404).json({ message: 'Clé invalide ou billet introuvable.' });
  }

  try {
    const qrCodeBase64 = await QRCode.toDataURL(cle_achat);
    res.status(200).json({ cle: cle_achat, qrCode: qrCodeBase64 });
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la génération du QR code.' });
  }
});

// Version image PNG
router.get('/qr/:cle_achat/image', verifyToken, async (req, res) => {
  const { cle_achat } = req.params;
  const billet = getBilletParCle(cle_achat);

  if (!billet) {
    return res.status(404).json({ message: 'Clé invalide ou billet introuvable.' });
  }

  try {
    const buffer = await QRCode.toBuffer(cle_achat, {
      type: 'png',
      width: 300,
      margin: 2
    });
    res.set('Content-Type', 'image/png');
    res.send(buffer);
  } catch (err) {
    res.status(500).json({ message: 'Erreur lors de la génération du QR code image.' });
  }
});

module.exports = router;
