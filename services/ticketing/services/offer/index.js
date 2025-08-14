const { createOfferService } = require('./createOffer.service');
const { readOfferService } = require('./readOffer.service');
const { updateOfferService } = require('./updateOffer.service');
const { deleteOfferService } = require('./deleteOffer.service');
const { listOffersService }  = require('./listOffers.service');

module.exports = {
  createOfferService,
  readOfferService,
  updateOfferService,
  deleteOfferService,
  listOffersService
};
