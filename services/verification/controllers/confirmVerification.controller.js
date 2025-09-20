const { confirmVerificationService } = require('../services/confirmVerification.service');
const { sendBusinessError } = require('../utils/sendError');
const { sendBusinessSuccess } = require('../utils/sendSuccess');
const logger = require('../utils/logger');
const { ERROR_STATUS } = require('../utils/httpErrorMap');

async function confirmVerificationController(req, res) {
  logger.info('[CONFIRM VERIFICATION CTRL] Incoming request', {
    method: req.method,
    url: req.originalUrl,
    body: req.body,
    user: req.user
  });

  try {
    if (!req.user || !['AGENT', 'EMPLOYEE', 'ADMIN'].includes(req.user.role)) {
      return sendBusinessError(res, 'FORBIDDEN');
    }

    const qrPayload = req.body; // ticketId, eventId, userId, zone, price, issuedAt, signature
    if (!qrPayload.ticketId || isNaN(Number(qrPayload.ticketId))) {
      return sendBusinessError(res, 'INVALID_TICKET_ID');
    }

    const result = await confirmVerificationService(qrPayload, req.headers.authorization);
    return sendBusinessSuccess(res, 'CONFIRM_VERIFICATION', result);

  } catch (err) {
    logger.error('[CONFIRM VERIFICATION CTRL] Error', { message: err.message });
    const code = err?.statusCode
      || (err?.message && err.message in ERROR_STATUS ? err.message : 'INTERNAL_SERVER_ERROR');
    return sendBusinessError(res, code);
  }
}

module.exports = { confirmVerificationController };
