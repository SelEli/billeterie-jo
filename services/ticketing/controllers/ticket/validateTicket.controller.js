// controllers/tickets/validateTicket.controller.js
const { validateTicketService } = require('../../services/ticket/validateTicket.service');
const { sendBusinessError } = require('../../utils/sendError');
const { sendBusinessSuccess } = require('../../utils/sendSuccess');
const logger = require('../../utils/logger');

async function validateTicketController(req, res) {
  try {
    const { ticketId } = req.body;
    const updated = await validateTicketService(ticketId);
    return sendBusinessSuccess(res, 'VALIDATE_TICKET', updated, { message: 'Ticket validated successfully' });
  } catch (err) {
    logger.error('[TICKET][VALIDATE] Error:', err);
    return sendBusinessError(res, err.message || 'INTERNAL_SERVER_ERROR');
  }
}

module.exports = { validateTicketController };
