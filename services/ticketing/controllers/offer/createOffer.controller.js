// controllers/offer/createOffer.controller.js
const { createOfferSchema } = require('../../validators/offer.validator');
const offerCreationService = require('../../services/offer/offerCreation.service');
const logger = require('../../utils/logger');

module.exports = async (req, res) => {
  try {
    if (!['ADMIN', 'AGENT'].includes(req.user.role)) {
      return res.status(403).json({ status: 'error', meta: { message: 'Forbidden' } });
    }

    const parsed = createOfferSchema.parse({
      ...req.body,
      // Convertir eventId en number si string
      eventId: req.body.eventId ? Number(req.body.eventId) : undefined
    });

    const offer = await offerCreationService(parsed);

    res.status(201).json({
      status: 'success',
      data: { offerId: offer.id },
      meta: { message: 'Offer created successfully' }
    });
  } catch (err) {
    logger.error(err);
    res.status(400).json({ status: 'error', meta: { message: err.message } });
  }
};
