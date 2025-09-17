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

  try {
    const isMock = (process.env.USE_MOCK_PAYMENT || '').toLowerCase() === 'true';
    const authHeader = req.headers.authorization || null;

    logger.debug('[CONFIRM PAYMENT CTRL] Appel du service confirmPaymentService', { ticketId, isMock });

    // 🔹 Passer le Bearer du propriétaire directement au service
    const result = await confirmPaymentService(ticketId, authHeader, isMock);

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
