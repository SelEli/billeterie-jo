const express = require('express');
const router = express.Router();

const verifyToken = require('../middlewares/auth.middleware');
const verifyRole = require('../middlewares/role.middleware');
const {
  validerBillet,
  afficherValidation,
  listerValidations
} = require('../controllers/validation.controller');

// POST /api/validation — Valider un billet (clé invisible + clé achat)
router.post(
  '/',
  verifyToken,
  verifyRole(['employe', 'admin']),
  validerBillet
);

// GET /api/validation/:id — Détail d’une validation spécifique
router.get(
  '/:id',
  verifyToken,
  verifyRole(['employe', 'admin']),
  afficherValidation
);

// GET /api/validation — Liste de toutes les validations
router.get(
  '/',
  verifyToken,
  verifyRole(['admin']),
  listerValidations
);

module.exports = router;
