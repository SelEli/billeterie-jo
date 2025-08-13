// controllers/offer/updateOffer.controller.js
const { updateOfferSchema } = require('../../validators/offer.validator');
const offerUpdateService = require('../../services/offer/offerUpdate.service');
const logger = require('../../utils/logger');

module.exports = async (req, res) => {
  try {
    if (req.user.role !== 'ADMIN') {
      return res.status(403).json({ status: 'error', meta: { message: 'Forbidden' } });
    }

    const parsed = updateOfferSchema.parse({
      ...req.body,
      eventId: req.body.eventId ? Number(req.body.eventId) : undefined
    });

    await offerUpdateService(req.params.id, parsed);

    res.json({
      status: 'success',
      data: { updated: true },
      meta: { message: 'Offer updated successfully' }
    });
  } catch (err) {
    logger.error(err);
    res.status(400).json({ status: 'error', meta: { message: err.message } });
  }
};
