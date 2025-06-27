const express = require('express');
const router = express.Router();

const verifyToken = require('../middlewares/auth.middleware');
const verifyRole = require('../middlewares/role.middleware');
const {
  creerEvenement,
  listerEvenements,
  obtenirEvenement,
  modifierEvenement,
  supprimerEvenement
} = require('../controllers/evenement.controller');

// 📢 Routes publiques
router.get('/', listerEvenements); // liste complète
router.get('/:id', obtenirEvenement); // détail d’un événement


// 🔐 Routes admin protégées
router.post(
  '/',
  verifyToken,
  verifyRole(['admin']),
  creerEvenement
);

router.put(
  '/:id',
  verifyToken,
  verifyRole(['admin']),
  modifierEvenement
);

router.delete(
  '/:id',
  verifyToken,
  verifyRole(['admin']),
  supprimerEvenement
);

module.exports = router;
