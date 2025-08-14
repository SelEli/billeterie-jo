const { updateOfferSchema } = require('../../schemas/offer.schema');
const { updateOfferService } = require('../../services/offer/updateOffer.service');
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

    logger.info(`[OFFER CONTROLLER] Updating offer ${req.params.id} by user ${req.user.id}`);
    await updateOfferService(req.params.id, parsed);
    logger.info(`[OFFER CONTROLLER] Offer updated: ${req.params.id}`);

    res.json({
      status: 'success',
      data: { updated: true },
      meta: { message: 'Offer updated successfully' }
    });
  } catch (err) {
    logger.error(`[OFFER CONTROLLER] Update failed for ${req.params.id}: ${err.message}`);
    res.status(400).json({ status: 'error', meta: { message: err.message } });
  }
};
