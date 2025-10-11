const logger  = require('../../utils/logger');
const monitor = require('../../monitor/monitor');
const { updateOfferService } = require('../../services/offer/updateOffer.service');
const { sendBusinessError } = require('../../utils/sendError');
const { sendBusinessSuccess } = require('../../utils/sendSuccess');
const { ERROR_STATUS } = require('../../utils/httpErrorMap');

async function updateOfferController(req, res) {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id <= 0) {
    return sendBusinessError(res, 'INVALID_OFFER_ID');
  }

  if (!req.user || req.user.role !== 'ADMIN') {
    logger.warn('[OFFER CONTROLLER] Accès refusé', { user: req.user });
    return sendBusinessError(res, 'FORBIDDEN');
  }

  // ✅ Données déjà validées et transformées par le middleware
  const safePayload = req.validated;

  const timer = monitor.timer('offer_update').start();
  try {
    logger.debug('[OFFER CONTROLLER] Appel service updateOfferService', { id, ...safePayload });
    const offer = await updateOfferService(id, safePayload);
    timer.stop();

    if (!offer) {
      return sendBusinessError(res, 'OFFER_NOT_FOUND');
    }

    logger.info('[OFFER CONTROLLER] Offer mise à jour', { offerId: id });
    return sendBusinessSuccess(res, 'UPDATE_OFFER', offer, {
      message: 'Offer updated successfully'
    });
  } catch (error) {
    timer.stop();
    logger.error('[OFFER CONTROLLER] Erreur update offer', {
      error: error.message,
      stack: error.stack
    });
    const code =
      error.message && ERROR_STATUS && ERROR_STATUS[error.message]
        ? error.message
        : 'INTERNAL_SERVER_ERROR';
    return sendBusinessError(res, code);
  }
}

module.exports = { updateOfferController };
