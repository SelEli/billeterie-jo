const { startVerificationService } = require('../services/startVerification.service');
const { sendBusinessError } = require('../utils/sendError');
const { sendBusinessSuccess } = require('../utils/sendSuccess');
const logger = require('../utils/logger');

/**
 * Controller pour démarrer la vérification d'un ticket
 */
async function startVerificationController(req, res) {
  logger.info('[START VERIFICATION CTRL] Incoming request', {
    method: req.method,
    url: req.originalUrl,
    body: req.body,
    user: req.user
  });

  try {
    // 🔹 Vérification rôle
    if (!req.user || !['AGENT', 'EMPLOYEE', 'ADMIN'].includes(req.user.role)) {
      return sendBusinessError(res, 'FORBIDDEN');
    }

    const { ticketId, signature } = req.body;
    if (!ticketId || isNaN(Number(ticketId))) {
      return sendBusinessError(res, 'INVALID_TICKET_ID');
    }
    if (!signature) {
      return sendBusinessError(res, 'MISSING_SIGNATURE');
    }

    // 🔹 Service de vérification (on passe req.user complet)
    const result = await startVerificationService({ ticketId, signature }, req.user);

    if (result.status === 'error') {
      return sendBusinessError(res, result.errors?.[0] || 'VERIFY_FAILED');
    }

    return sendBusinessSuccess(res, 'VERIFY_TICKET', result.data);
  } catch (err) {
    logger.error('[START VERIFICATION CTRL] Error', { message: err.message, stack: err.stack });
    return sendBusinessError(res, 'INTERNAL_SERVER_ERROR');
  }
}

module.exports = { startVerificationController };
