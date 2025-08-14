const { createOfferSchema } = require('../../schemas/offer.schema');
const { createOfferService } = require('../../services/offer/createOffer.service');
const logger = require('../../utils/logger');

module.exports = async (req, res) => {
  try {
    if (!['ADMIN', 'AGENT'].includes(req.user.role)) {
      return res.status(403).json({ status: 'error', meta: { message: 'Forbidden' } });
    }

    const parsed = createOfferSchema.parse({
      ...req.body,
      eventId: req.body.eventId ? Number(req.body.eventId) : undefined
    });

    logger.info(`[OFFER CONTROLLER] Creating offer for event ${parsed.eventId} by user ${req.user.id}`);
    const offer = await createOfferService(parsed);
    logger.info(`[OFFER CONTROLLER] Offer created: ${offer.id}`);

    res.status(201).json({
      status: 'success',
      data: { offerId: offer.id },
      meta: { message: 'Offer created successfully' }
    });
  } catch (err) {
    logger.error(`[OFFER CONTROLLER] Create failed: ${err.message}`);
    res.status(400).json({ status: 'error', meta: { message: err.message } });
  }
};
