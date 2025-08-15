// controllers/offer/listOffers.controller.js
const { listOffersService } = require('../../services/offer');
const logger = require('../../utils/logger');

async function listOffersController(req, res) {
  try {
    const { eventId, targetRole, active, validNow } = req.query || {};
    const where = {};

    if (typeof active !== 'undefined') {
      if (!['true', 'false'].includes(active)) {
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

    const offers = await listOffersService(where, { validNow: validNow === 'true' });

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
