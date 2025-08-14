const { listOffersService } = require('../../services/offer/listOffers.service');
const logger = require('../../utils/logger');

module.exports = async (req, res) => {
  try {
    const { eventId, targetRole, active, validNow } = req.query;
    const where = {};

    if (typeof active !== 'undefined') where.active = active === 'true';
    if (eventId) where.eventId = Number(eventId);
    if (targetRole) where.targetRole = targetRole;

    logger.debug(`[OFFER CONTROLLER] Listing offers with filter: ${JSON.stringify(where)}`);
    const offers = await listOffersService(where, { validNow: validNow === 'true' });

    logger.info(`[OFFER CONTROLLER] Offers listed: ${offers.length}`);
    res.json({ status: 'success', data: offers });
  } catch (err) {
    logger.error(`[OFFER CONTROLLER] List failed: ${err.message}`);
    res.status(400).json({ status: 'error', meta: { message: err.message } });
  }
};
