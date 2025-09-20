const { startVerificationService } = require('../services/startVerification.service');
const { sendBusinessError } = require('../utils/sendError');
const { sendBusinessSuccess } = require('../utils/sendSuccess');
const logger = require('../utils/logger');
const { ERROR_STATUS } = require('../utils/httpErrorMap');

async function startVerificationController(req, res) {
  logger.info('[START VERIFICATION CTRL] Incoming request', {
    method: req.method,
    url: req.originalUrl,
    body: req.body,
    user: req.user
  });

  try {
    if (!req.user || !['AGENT', 'EMPLOYEE', 'ADMIN'].includes(req.user.role)) {
      return sendBusinessError(res, 'FORBIDDEN');
    }

    const { ticketId } = req.body;
    if (!ticketId || isNaN(Number(ticketId))) {
      return sendBusinessError(res, 'INVALID_TICKET_ID');
    }

    const result = await startVerificationService(Number(ticketId), req.headers.authorization);
    return sendBusinessSuccess(res, 'START_VERIFICATION', result);

  } catch (err) {
    logger.error('[START VERIFICATION CTRL] Error', { message: err.message });
    const code = err?.statusCode
      || (err?.message && err.message in ERROR_STATUS ? err.message : 'INTERNAL_SERVER_ERROR');
    return sendBusinessError(res, code);
  }
}

module.exports = { startVerificationController };
