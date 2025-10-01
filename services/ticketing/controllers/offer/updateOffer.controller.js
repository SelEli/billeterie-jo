const logger  = require('../../utils/logger');
const monitor = require('../../monitor/monitor');
const { OfferUpdateSchema } = require('../../schemas/offer.schema');
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
    return sendBusinessError(res, 'FORBIDDEN');
  }

  let parsed;
  try {
    parsed = OfferUpdateSchema.parse({
      ...req.body,
      eventId: req.body?.eventId ? Number(req.body.eventId) : undefined
    });
  } catch (err) {
    logger.warn('[OFFER CONTROLLER] Validation échouée', { issues: err.issues });
    return sendBusinessError(res, 'INVALID_OFFER_DATA', err.issues?.map(i => i.message));
  }

  const { id: ignored, ...safePayload } = parsed;

  const timer = monitor.timer('offer_update').start();
  try {
    const offer = await updateOfferService(id, safePayload);
    timer.stop();

    if (!offer) {
      return sendBusinessError(res, 'OFFER_NOT_FOUND');
    }

    logger.info('[OFFER CONTROLLER] Offer mise à jour', { offerId: id });
    return sendBusinessSuccess(res, 'UPDATE_OFFER', offer, { message: 'Offer updated successfully' });
  } catch (error) {
    timer.stop();
    logger.error('[OFFER CONTROLLER] Erreur update offer', { error: error.message });
    const code = error.message && error.message in ERROR_STATUS
      ? error.message
      : 'INTERNAL_SERVER_ERROR';
    return sendBusinessError(res, code);
  }
}

module.exports = { updateOfferController };
