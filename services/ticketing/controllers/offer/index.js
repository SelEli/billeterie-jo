// controllers/offer/index.js
const createOfferController = require('./createOffer.controller');
const readOfferController   = require('./readOffer.controller');
const listOffersController  = require('./listOffers.controller');
const updateOfferController = require('./updateOffer.controller');
const deleteOfferController = require('./deleteOffer.controller');
const logger = require('../../utils/logger');

// Vérification stricte des contrôleurs
[
  ['createOfferController', createOfferController],
  ['readOfferController', readOfferController],
  ['listOffersController', listOffersController],
  ['updateOfferController', updateOfferController],
  ['deleteOfferController', deleteOfferController]
].forEach(([name, fn]) => {
  if (typeof fn !== 'function') {
    logger.error(`❌ Contrôleur ${name} est undefined ou mal exporté`);
    throw new Error(`❌ Contrôleur ${name} est undefined ou mal exporté`);
  }
  logger.debug(`✅ Contrôleur ${name} chargé`);
});

module.exports = {
  createOfferController,
  readOfferController,
  listOffersController,
  updateOfferController,
  deleteOfferController
};
