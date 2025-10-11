const logger = require('../../utils/logger');
const monitor = require('../../monitor/monitor');
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
    logger.warn('[OFFER CONTROLLER] Accès refusé', { user: req.user });
    return sendBusinessError(res, 'FORBIDDEN');
  }

  // ✅ Données déjà validées et transformées par le middleware
  const safePayload = req.validated;

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
    logger.error('[OFFER CONTROLLER] Erreur création offer', {
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

module.exports = { createOfferController };
