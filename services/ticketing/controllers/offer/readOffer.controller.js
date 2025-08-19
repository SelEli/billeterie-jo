// controllers/offer/readOffer.controller.js
const { readOfferService } = require('../../services/offer');
const logger = require('../../utils/logger');

async function readOfferController(req, res) {
  const { id } = req.params;
  try {
    const numId = Number(id);
    if (!id || isNaN(numId) || numId <= 0) {
      return res.status(400).json({
        status: 'error',
        data: null,
        errors: ['Invalid offer ID'],
        meta: {}
      });
    }

    const offer = await readOfferService(numId);

    if (!offer) {
      return res.status(404).json({
        status: 'error',
        data: null,
        errors: ['Offer not found'],   // ← aligné avec le contrat
        meta: {}
      });
    }

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
        errors: ['Offer not found'],   // ← idem dans le catch
        meta: {}
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
