const { startPaymentService } = require('../services/startPayment.service');
const { sendBusinessError } = require('../utils/sendError');
const { sendBusinessSuccess } = require('../utils/sendSuccess');
const logger = require('../utils/logger');

async function startPaymentController(req, res) {
  const { ticketId } = req.body; // amount ignoré

  logger.info('[START PAYMENT CTRL] Requête reçue', {
    body: req.body,
    user: req.user || null
  });

  if (!req.user) {
    return sendBusinessError(res, 'FORBIDDEN', 403);
  }

  try {
    const isMock = (process.env.USE_MOCK_PAYMENT || '').toLowerCase() === 'true';

    logger.debug('[START PAYMENT CTRL] Appel du service startPaymentService', {
      ticketId,
      isMock
    });

    // 👉 On passe directement req.user au service
    const result = await startPaymentService(ticketId, req.user, isMock);

    logger.info('[START PAYMENT CTRL] Paiement démarré avec succès', {
      ticketId: result.ticketId,
      amount: result.amount,
      status: result.status
    });

    return sendBusinessSuccess(res, 'START_PAYMENT', result);
  } catch (err) {
    logger.error('[START PAYMENT CTRL] Erreur lors du démarrage du paiement', {
      message: err.message,
      stack: err.stack,
      body: req.body
    });

    return sendBusinessError(res, err.message || 'INTERNAL_SERVER_ERROR');
  }
}

module.exports = { startPaymentController };
