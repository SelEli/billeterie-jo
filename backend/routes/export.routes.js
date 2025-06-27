const express = require('express');
const router = express.Router();

const { exporterBilletsCSV, exporterPaiementsCSV } = require('../controllers/export.controller');
const verifyToken = require('../middlewares/auth.middleware');
const verifyRole = require('../middlewares/role.middleware');

// 🔒 Admin uniquement pour les exports
router.get('/billets', verifyToken, verifyRole(['admin']), exporterBilletsCSV);
router.get('/paiements', verifyToken, verifyRole(['admin']), exporterPaiementsCSV);

module.exports = router;
