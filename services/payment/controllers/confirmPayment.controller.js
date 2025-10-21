const { confirmPaymentService } = require('../services/confirmPayment.service');
const { sendBusinessError } = require('../utils/sendError');
const { sendBusinessSuccess } = require('../utils/sendSuccess');
const logger = require('../utils/logger');

async function confirmPaymentController(req, res) {
  const { ticketId } = req.body; // amount ignoré

  logger.info('[CONFIRM PAYMENT CTRL] Requête reçue', {
    body: req.body,
    user: req.user || null
  });

  if (!req.user) {
    return sendBusinessError(res, 'FORBIDDEN', 403);
  }

  try {
    const isMock = (process.env.USE_MOCK_PAYMENT || '').toLowerCase() === 'true';

    logger.debug('[CONFIRM PAYMENT CTRL] Appel du service confirmPaymentService', { ticketId, isMock });

    // 👉 On passe directement req.user
    const result = await confirmPaymentService(ticketId, req.user, isMock);

    logger.info('[CONFIRM PAYMENT CTRL] Paiement confirmé avec succès', {
      ticketId: result.ticketId,
      amount: result.amount,
      status: result.status
    });

    return sendBusinessSuccess(res, 'CONFIRM_PAYMENT', result);

  } catch (err) {
    logger.error('[CONFIRM PAYMENT CTRL] Erreur lors de la confirmation du paiement', {
      message: err.message,
      stack: err.stack,
      body: req.body
    });

    const code = err.statusCode || 'INTERNAL_SERVER_ERROR';
    return sendBusinessError(res, code);
  }
}

module.exports = { confirmPaymentController };
