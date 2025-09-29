const express = require('express');
const router = express.Router();

const authenticate = require('../middlewares/auth.middleware');
const validateRequest = require('../middlewares/validateRequest.middleware');
const logger = require('../utils/logger');

const { createOfferSchema, updateOfferSchema } = require('../validators/offer.validator');

const {
  createOfferController,
  readOfferController,
  updateOfferController,
  deleteOfferController,
  listOffersController
} = require('../controllers/offer');

// Vérification stricte des contrôleurs
[
  ['createOfferController', createOfferController],
  ['readOfferController', readOfferController],
  ['updateOfferController', updateOfferController],
  ['deleteOfferController', deleteOfferController],
  ['listOffersController', listOffersController]
].forEach(([name, fn]) => {
  if (typeof fn !== 'function') {
    throw new Error(`❌ Contrôleur ${name} est undefined ou mal exporté`);
  }
});

// Middleware de log compact global
router.use((req, res, next) => {
  logger.debug(
    `[OFFER ROUTES] ${req.method} ${req.originalUrl} | params=${JSON.stringify(
      req.params
    )} | query=${JSON.stringify(req.query)} | body=${JSON.stringify(req.body)}`
  );
  next();
});

// ----------- ROUTES -----------

// Création d’offre (protégé)
router.post('/', authenticate, validateRequest(createOfferSchema), createOfferController);

// Lecture d’une offre par ID (public)
router.get('/:id', readOfferController);

// Mise à jour d’une offre (protégé)
router.put('/:id', authenticate, validateRequest(updateOfferSchema), updateOfferController);

// Suppression d’une offre (protégé)
router.delete('/:id', authenticate, deleteOfferController);

// Liste des offres (public)
router.get('/', listOffersController);

module.exports = router;
