const { listOffersService } = require('../../services/offer'); // ⬅️ import agrégateur mockable
const logger = require('../../utils/logger');

async function listOffersController(req, res) {
  try {
    const { eventId, targetRole, active, validNow } = req.query || {};
    const where = {};

    if (typeof active !== 'undefined') {
      if (!['true', 'false'].includes(active)) {
        logger.warn(`[OFFER CONTROLLER] Invalid active filter: "${active}"`);
        return res.status(400).json({
          status: 'error',
          data: null,
          errors: [],
          meta: { message: 'Invalid active value, must be true or false' }
        });
      }
      where.active = active === 'true';
    }

    if (eventId) {
      const numId = Number(eventId);
      if (isNaN(numId) || numId <= 0) {
        logger.warn(`[OFFER CONTROLLER] Invalid eventId: "${eventId}"`);
        return res.status(400).json({
          status: 'error',
          data: null,
          errors: [],
          meta: { message: 'Invalid eventId' }
        });
      }
      where.eventId = numId;
    }

    if (targetRole) {
      where.targetRole = targetRole;
    }

    const nowFlag = validNow === 'true';
    logger.debug(
      `[OFFER CONTROLLER] Listing offers with filter: ${JSON.stringify(where)}, validNow=${nowFlag}`
    );

    const offers = await listOffersService(where, { validNow: nowFlag });

    logger.info(`[OFFER CONTROLLER] Offers listed: count=${offers.length}`);
    return res.status(200).json({
      status: 'success',
      data: offers,
      errors: [],
      meta: { count: offers.length }
    });
  } catch (err) {
    logger.error(`[OFFER CONTROLLER] List failed: ${err.message}`);
    return res.status(500).json({
      status: 'error',
      data: null,
      errors: [err.message || 'Internal server error'],
      meta: {}
    });
  }
}

module.exports = { listOffersController };
