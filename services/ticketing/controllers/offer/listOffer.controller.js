// controllers/offer/listOffers.controller.js
const { offerQueryService } = require('../../services/offer/offerQuery.service');
const logger = require('../../utils/logger');

module.exports = async (req, res) => {
  try {
    const { eventId, targetRole, active, validNow } = req.query;
    const where = {};

    if (typeof active !== 'undefined') where.active = active === 'true';
    if (eventId) where.eventId = Number(eventId);
    if (targetRole) where.targetRole = targetRole;

    const offers = await offerQueryService(where, { validNow: validNow === 'true' });

    logger.info(`Offers listed: ${offers.length}`);
    res.json({ status: 'success', data: offers });
  } catch (err) {
    logger.error(err);
    res.status(400).json({ status: 'error', meta: { message: err.message } });
  }
};
