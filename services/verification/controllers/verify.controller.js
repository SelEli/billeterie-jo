// controllers/verify.controller.js
const { verifyService } = require('../services/verify.service');
const { sendBusinessError } = require('../utils/sendError');
const { sendBusinessSuccess } = require('../utils/sendSuccess');
const logger = require('../utils/logger');

async function verifyController(req, res) {
  try {
    // Autorisation : AGENT ou EMPLOYEE
    if (!req.user || !['AGENT', 'EMPLOYEE'].includes(req.user.role)) {
      return sendBusinessError(res, 'FORBIDDEN');
    }

    const qrPayload = req.body; // doit contenir ticketId, eventId, userId, zone, price, issuedAt, signature
    if (!qrPayload.ticketId) {
      return sendBusinessError(res, 'INVALID_TICKET_ID');
    }

    logger.info('[VERIFY CTRL] Vérification ticket', {
      ticketId: qrPayload.ticketId,
      verifierId: req.user.userId
    });

    const result = await verifyService(qrPayload, req.headers.authorization);

    return sendBusinessSuccess(res, 'VERIFY_TICKET', result);
  } catch (err) {
    logger.error('[VERIFY CTRL] Error', { message: err.message });
    const code =
      err &&
      err.message &&
      err.message in require('../utils/httpErrorMap').ERROR_STATUS
        ? err.message
        : 'INTERNAL_SERVER_ERROR';
    return sendBusinessError(res, code);
  }
}

module.exports = { verifyController };
