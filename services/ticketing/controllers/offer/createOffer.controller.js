const logger = require('../../utils/logger');
const monitor = require('../../monitor/monitor');
const { OfferCreateSchema } = require('../../schemas/offer.schema');
const { createOfferService } = require('../../services/offer/createOffer.service');
const { sendBusinessError } = require('../../utils/sendError');
const { sendBusinessSuccess } = require('../../utils/sendSuccess');
const { ERROR_STATUS } = require('../../utils/httpErrorMap');

async function createOfferController(req, res) {
  logger.debug('[OFFER CONTROLLER] Requête création offer reçue', {
    user: req.user,
    body: req.body
  });

  if (!req.user || !['ADMIN', 'AGENT'].includes(req.user.role)) {
    return sendBusinessError(res, 'FORBIDDEN');
  }

  // Validation Zod
  let parsed;
  try {
    parsed = OfferCreateSchema.parse(req.body);
  } catch (err) {
    logger.warn('[OFFER CONTROLLER] Validation échouée', { issues: err.issues });
    return sendBusinessError(res, 'INVALID_OFFER_DATA', err.issues?.map(i => i.message));
  }

  // Nettoyage payload
  const { id, ...safePayload } = parsed;

  const timer = monitor.timer('offer_create').start();
  try {
    logger.debug('[OFFER CONTROLLER] Appel service createOfferService', safePayload);
    const offer = await createOfferService(safePayload);

    timer.stop();
    logger.info('[OFFER CONTROLLER] Offer créée avec succès', { offerId: offer.id });

    return sendBusinessSuccess(res, 'CREATE_OFFER', { offerId: offer.id }, {
      message: 'Offer created successfully'
    });
  } catch (error) {
    timer.stop();
    logger.error('[OFFER CONTROLLER] Erreur création offer', { error: error.message });
    const code =
      error.message && error.message in ERROR_STATUS
        ? error.message
        : 'INTERNAL_SERVER_ERROR';
    return sendBusinessError(res, code);
  }
}

module.exports = { createOfferController };
