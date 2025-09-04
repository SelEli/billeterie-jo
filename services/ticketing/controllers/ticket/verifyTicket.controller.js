// controllers/ticket/verifyTicket.controller.js
const { createAdapters } = require('../../adapters');
const { verifyTicketService } = require('../../services/ticket/verifyTicket.service');
const { sendBusinessError } = require('../../utils/sendError');
const { sendBusinessSuccess } = require('../../utils/sendSuccess');
const logger = require('../../utils/logger');

async function verifyTicketController(req, res) {
  try {
    if (!req.user || !['AGENT', 'EMPLOYEE'].includes(req.user.role)) {
      return sendBusinessError(res, 'FORBIDDEN');
    }

    const { ticketId } = req.body;
    if (!ticketId || isNaN(Number(ticketId))) {
      return sendBusinessError(res, 'INVALID_TICKET_ID');
    }

    const adapters = createAdapters();

    if ((process.env.USE_EXTERNAL_VERIFICATION || '').toLowerCase() === 'true') {
      logger.info('[VERIFY CTRL] Délégation au service Verification externe');
      const out = await adapters.verification.requestTicketVerification(
        Number(ticketId),
        req.headers.authorization
      );
      return res.status(200).json(out);
    }

    logger.info('[VERIFY CTRL] Vérification interne');
    const updated = await verifyTicketService(
      Number(ticketId),
      req.user.userId,
      req.user.role,
      req.headers.authorization
    );

    if (!updated) {
      return sendBusinessError(res, 'TICKET_NOT_FOUND');
    }

    adapters.verification.notifyTicketVerified(updated).catch(() => {});

    return sendBusinessSuccess(res, 'VERIFY_TICKET', updated);
  } catch (err) {
    logger.error('[VERIFY CTRL] Error:', err);
    const code = err && err.message && err.message in require('../../utils/httpErrorMap').ERROR_STATUS
      ? err.message
      : 'INTERNAL_SERVER_ERROR';
    return sendBusinessError(res, code);
  }
}

module.exports = { verifyTicketController };
