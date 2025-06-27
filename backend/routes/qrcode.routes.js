const express = require('express');
const router = express.Router();

const { genererQRCodePourCle } = require('../controllers/qrcode.controller');
const verifyToken = require('../middlewares/auth.middleware');
// const verifyRole = require('../middlewares/role.middleware'); // à activer si besoin de filtrer

// GET /api/qrcode/:cle_achat — accès restreint aux utilisateurs connectés
router.get('/:cle_achat', verifyToken, genererQRCodePourCle);

// Pour restreindre à un rôle spécifique (ex. agent ou admin) :
// router.get('/:cle_achat', verifyToken, verifyRole(['agent', 'admin']), genererQRCodePourCle);

module.exports = router;
