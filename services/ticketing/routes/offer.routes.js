const express = require('express');
const router = express.Router();

const authenticate = require('../middlewares/auth.middleware');
const validateRequest = require('../middlewares/validateRequest.middleware');

const { OfferCreateSchema, OfferUpdateSchema } = require('../schemas/offer.schema');

const {
  createOfferController,
  readOfferController,
  updateOfferController,
  deleteOfferController,
  listOffersController
} = require('../controllers/offer');

// Vérification imports stricts
if (
  typeof createOfferController !== 'function' ||
  typeof readOfferController !== 'function' ||
  typeof updateOfferController !== 'function' ||
  typeof deleteOfferController !== 'function' ||
  typeof listOffersController !== 'function'
) {
  throw new Error('❌ Un ou plusieurs contrôleurs Offer sont undefined ou mal exportés');
}

// Debug global
router.use((req, res, next) => {
  console.log(`🔹 [ROUTES DEBUG][OFFER] ${req.method} ${req.originalUrl} reçu`);
  console.log('🔹 Headers:', req.headers);
  console.log('🔹 Body brut:', req.body);
  next();
});

function debugAuth(req, res, next) {
  console.log(`🔹 [ROUTES DEBUG][OFFER] Appel authenticate pour ${req.method} ${req.originalUrl}`);
  next();
}
function debugValidate(schemaName) {
  return (req, res, next) => {
    console.log(`🔹 [ROUTES DEBUG][OFFER] Validation ${schemaName} avant controller`);
    next();
  };
}

// ----------- ROUTES -----------
router.post(
  '/',
  debugAuth,
  authenticate,
  debugValidate('OfferCreateSchema'),
  validateRequest(OfferCreateSchema),
  (req, res, next) => {
    console.log('🔹 [ROUTES DEBUG][OFFER] POST / => avant createOfferController', {
      user: req.user,
      validated: req.validated,
    });
    next();
  },
  createOfferController
);

router.get(
  '/:id',
  debugAuth,
  authenticate,
  (req, res, next) => {
    console.log('🔹 [ROUTES DEBUG][OFFER] GET /:id => avant readOfferController', {
      params: req.params,
      user: req.user,
    });
    next();
  },
  readOfferController
);

router.put(
  '/:id',
  debugAuth,
  authenticate,
  debugValidate('OfferUpdateSchema'),
  validateRequest(OfferUpdateSchema),
  (req, res, next) => {
    console.log('🔹 [ROUTES DEBUG][OFFER] PUT /:id => avant updateOfferController', {
      params: req.params,
      user: req.user,
      validated: req.validated,
    });
    next();
  },
  updateOfferController
);

router.delete(
  '/:id',
  debugAuth,
  authenticate,
  (req, res, next) => {
    console.log('🔹 [ROUTES DEBUG][OFFER] DELETE /:id => avant deleteOfferController', {
      params: req.params,
      user: req.user,
    });
    next();
  },
  deleteOfferController
);

router.get(
  '/',
  debugAuth,
  authenticate,
  (req, res, next) => {
    console.log('🔹 [ROUTES DEBUG][OFFER] GET / => avant listOffersController', { user: req.user });
    next();
  },
  listOffersController
);

module.exports = router;
