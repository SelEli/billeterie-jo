// controllers/ticket/validateTicket.controller.js
const { createAdapters } = require('../../adapters');
const { validateTicketService } = require('../../services/ticket/validateTicket.service');
const { sendBusinessError } = require('../../utils/sendError');
const { sendBusinessSuccess } = require('../../utils/sendSuccess');
const logger = require('../../utils/logger');

async function validateTicketController(req, res) {
  try {
    if (!req.user || req.user.role !== 'PAYMENT') {
      return sendBusinessError(res, 'FORBIDDEN');
    }

    const { ticketId } = req.body;
    if (!ticketId || isNaN(Number(ticketId))) {
      return sendBusinessError(res, 'INVALID_TICKET_ID');
    }

    const adapters = createAdapters();

    if ((process.env.USE_EXTERNAL_PAYMENT || '').toLowerCase() === 'true') {
      logger.info('[VALIDATE CTRL] Délégation au service Payment externe');
      const out = await adapters.payment.requestTicketValidation(
        Number(ticketId),
        req.headers.authorization
      );
      return res.status(200).json(out);
    }

    logger.info('[VALIDATE CTRL] Validation interne');
    const updated = await validateTicketService(Number(ticketId));

    if (!updated) {
      return sendBusinessError(res, 'TICKET_NOT_FOUND');
    }

    return sendBusinessSuccess(res, 'VALIDATE_TICKET', updated);
  } catch (err) {
    logger.error('[VALIDATE CTRL] Error:', err);
    const code = err && err.message && err.message in require('../../utils/httpErrorMap').ERROR_STATUS
      ? err.message
      : 'INTERNAL_SERVER_ERROR';
    return sendBusinessError(res, code);
  }
}

module.exports = { validateTicketController };
