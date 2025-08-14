const express = require('express');
const router = express.Router();

const authenticate = require('../middlewares/auth.middleware');
const validateRequest = require('../middlewares/validateRequest.middleware');
const logger = require('../utils/logger');

const { OfferCreateSchema, OfferUpdateSchema } = require('../validators/offer.validator');

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

// Middleware de debug centralisé
router.use((req, res, next) => {
  logger.debug(`[OFFER ROUTES] ${req.method} ${req.originalUrl}`);
  next();
});

// ----------- ROUTES -----------

router.post(
  '/',
  authenticate,
  validateRequest(OfferCreateSchema),
  (req, res, next) => {
    logger.info('[OFFER ROUTES] POST / => createOfferController');
    next();
  },
  createOfferController
);

router.get(
  '/:id',
  authenticate,
  (req, res, next) => {
    logger.info('[OFFER ROUTES] GET /:id => readOfferController');
    next();
  },
  readOfferController
);

router.put(
  '/:id',
  authenticate,
  validateRequest(OfferUpdateSchema),
  (req, res, next) => {
    logger.info('[OFFER ROUTES] PUT /:id => updateOfferController');
    next();
  },
  updateOfferController
);

router.delete(
  '/:id',
  authenticate,
  (req, res, next) => {
    logger.info('[OFFER ROUTES] DELETE /:id => deleteOfferController');
    next();
  },
  deleteOfferController
);

router.get(
  '/',
  authenticate,
  (req, res, next) => {
    logger.info('[OFFER ROUTES] GET / => listOffersController');
    next();
  },
  listOffersController
);

module.exports = router;
