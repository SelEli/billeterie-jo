const { createOfferSchema } = require('../../validators/offer.validator');
const { createOfferService } = require('../../services/offer');
const logger = require('../../utils/logger');

async function createOfferController(req, res) {
  try {
    if (!req.user || !['ADMIN', 'AGENT'].includes(req.user.role)) {
      return res.status(403).json({
        status: 'error',
        data: null,
        errors: ['Forbidden'],
        meta: {}
      });
    }

    if (!createOfferSchema || typeof createOfferSchema.parse !== 'function') {
      logger.error('[OFFER CONTROLLER] createOfferSchema missing or invalid');
      return res.status(500).json({
        status: 'error',
        data: null,
        errors: ['Server misconfiguration: offer schema missing'],
        meta: {}
      });
    }

    // Utilise req.validated si présent (tests), sinon valide le body
    const payload = req.validated ?? createOfferSchema.parse(req.body);

    const offer = await createOfferService(payload);

    return res.status(201).json({
      status: 'success',
      data: { offerId: offer.id },
      errors: [],
      meta: { message: 'Offer created successfully' }
    });
  } catch (err) {
    logger.error(`[OFFER CONTROLLER] Create failed: ${err.message}`);

    if (err?.name === 'ZodError') {
      return res.status(400).json({
        status: 'error',
        data: null,
        errors: err.issues?.map(i => i.message) ?? [err.message],
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

module.exports = { createOfferController };
