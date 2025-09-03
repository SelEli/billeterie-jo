// controllers/ticket/validateTicket.controller.js
const { validateTicketService } = require('../../services/ticket/validateTicket.service');
const { sendBusinessError } = require('../../utils/sendError');
const { sendBusinessSuccess } = require('../../utils/sendSuccess');
const logger = require('../../utils/logger');

/**
 * 🎯 Contrôleur : Validation d'un ticket
 * 🔒 Réservé au rôle PAYMENT uniquement
 * ✅ Appelle le service pour passer le ticket à VALID
 */
async function validateTicketController(req, res) {
  try {
    // 🔒 Vérification du rôle
    if (!req.user || req.user.role !== 'PAYMENT') {
      return sendBusinessError(res, 'FORBIDDEN', 403);
    }

    const { ticketId } = req.body;
    if (!ticketId || isNaN(Number(ticketId))) {
      return sendBusinessError(res, 'INVALID_TICKET_ID', 400);
    }

    const updated = await validateTicketService(Number(ticketId));
    return sendBusinessSuccess(res, 'VALIDATE_TICKET', updated, {
      message: 'Ticket validated successfully'
    });
  } catch (err) {
    logger.error('[TICKET][VALIDATE] Error:', err);
    return sendBusinessError(res, err.message || 'INTERNAL_SERVER_ERROR');
  }
}

module.exports = { validateTicketController };
