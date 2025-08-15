const { readOfferService } = require('../../services/offer'); // ⬅️ import agrégateur mockable
const logger = require('../../utils/logger');

async function readOfferController(req, res) {
  const { id } = req.params;
  try {
    const numId = Number(id);
    if (!id || isNaN(numId) || numId <= 0) {
      logger.warn(`[OFFER CONTROLLER] Invalid offer ID param: "${id}"`);
      return res.status(400).json({
        status: 'error',
        data: null,
        errors: [],
        meta: { message: 'Invalid offer ID' }
      });
    }

    logger.debug(`[OFFER CONTROLLER] Reading offer ${numId}`);
    const offer = await readOfferService(numId);

    if (!offer) {
      logger.info(`[OFFER CONTROLLER] Offer not found: ${numId}`);
      return res.status(404).json({
        status: 'error',
        data: null,
        errors: [],
        meta: { message: 'Offer not found' }
      });
    }

    logger.info(`[OFFER CONTROLLER] Offer read: ${offer.id}`);
    return res.status(200).json({
      status: 'success',
      data: offer,
      errors: [],
      meta: {}
    });
  } catch (err) {
    logger.error(`[OFFER CONTROLLER] Read failed for ${id}: ${err.message}`);

    if (err.statusCode === 404 || err.message === 'Offer not found') {
      return res.status(404).json({
        status: 'error',
        data: null,
        errors: [],
        meta: { message: err.message }
      });
    }

    return res.status(err.statusCode || 500).json({
      status: 'error',
      data: null,
      errors: [err.message || 'Internal server error'],
      meta: {}
    });
  }
}

module.exports = { readOfferController };
