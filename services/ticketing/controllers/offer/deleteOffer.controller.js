// controllers/offer/deleteOffer.controller.js
const { deleteOfferService } = require('../../services/offer');
const logger = require('../../utils/logger');

async function deleteOfferController(req, res) {
  try {
    // 🔒 Vérif rôle
    if (!req.user || req.user.role !== 'ADMIN') {
      return res.status(403).json({
        status: 'error',
        data: null,
        errors: ['Forbidden'],
        meta: {}
      });
    }

    // 🔍 Validation ID
    const id = Number(req.params.id);
    if (!id || isNaN(id) || id <= 0) {
      return res.status(400).json({
        status: 'error',
        data: null,
        errors: ['Invalid offer ID'],
        meta: {}
      });
    }

    // 🗑 Suppression
    const deleted = await deleteOfferService(id);

    if (!deleted) {
      return res.status(404).json({
        status: 'error',
        data: null,
        errors: ['Offer not found'],
        meta: {}
      });
    }

    // ✅ OK, rien à renvoyer
    return res.status(204).send();
  } catch (err) {
    logger.error(
      `[OFFER CONTROLLER] Delete failed for ${req.params.id}: ${err.message}`
    );

    if (err.statusCode === 404 || err.message === 'Offer not found') {
      return res.status(404).json({
        status: 'error',
        data: null,
        errors: ['Offer not found'],
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

module.exports = { deleteOfferController };
