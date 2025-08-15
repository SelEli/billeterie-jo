const { updateOfferSchema } = require('../../validators/offer.validator');
const { updateOfferService } = require('../../services/offer'); // ⬅️ import agrégateur mockable
const logger = require('../../utils/logger');

async function updateOfferController(req, res) {
  try {
    if (!req.user || req.user.role !== 'ADMIN') {
      return res.status(403).json({
        status: 'error',
        data: null,
        errors: ['Forbidden'],
        meta: {}
      });
    }

    const id = Number(req.params.id);
    if (!id || isNaN(id) || id <= 0) {
      return res.status(400).json({
        status: 'error',
        data: null,
        errors: ['Invalid offer ID'],
        meta: {}
      });
    }

    // Utiliser req.validated si présent (attente des tests), sinon valider body
    const payload = req.validated ?? updateOfferSchema.parse({
      ...req.body,
      eventId: req.body?.eventId ? Number(req.body.eventId) : undefined
    });

    logger.info(`[OFFER CONTROLLER] Updating offer ${id} by user ${req.user.id}`);
    const updated = await updateOfferService(id, payload);

    if (!updated) {
      return res.status(404).json({
        status: 'error',
        data: null,
        errors: [],
        meta: { message: 'Offer not found' }
      });
    }

    logger.info(`[OFFER CONTROLLER] Offer updated: ${id}`);
    return res.status(200).json({
      status: 'success',
      data: { updated: true },
      errors: [],
      meta: { message: 'Offer updated successfully' }
    });
  } catch (err) {
    logger.error(`[OFFER CONTROLLER] Update failed for ${req.params.id}: ${err.message}`);

    if (err?.name === 'ZodError') {
      return res.status(400).json({
        status: 'error',
        data: null,
        errors: err.issues?.map(i => i.message) ?? [err.message],
        meta: {}
      });
    }

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

module.exports = { updateOfferController };
