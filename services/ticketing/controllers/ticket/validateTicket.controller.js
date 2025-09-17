// controllers/ticket/validateTicket.controller.js
const { createAdapters } = require('../../adapters');
const { validateTicketService } = require('../../services/ticket/validateTicket.service');
const { sendBusinessError } = require('../../utils/sendError');
const { sendBusinessSuccess } = require('../../utils/sendSuccess');
const logger = require('../../utils/logger');

async function validateTicketController(req, res) {
  try {
    const { ticketId } = req.body;
    const ticketIdNum = Number(ticketId);
    if (!ticketId || isNaN(ticketIdNum)) {
      return sendBusinessError(res, 'INVALID_TICKET_ID');
    }

    logger.info('[VALIDATE CTRL] Validation ticket', { ticketId: ticketIdNum });

    // 1️⃣ Valider le ticket localement (avec signature)
    const updated = await validateTicketService(ticketIdNum, req.headers.authorization);

    if (!updated) {
      return sendBusinessError(res, 'TICKET_NOT_FOUND');
    }

    // 2️⃣ Si paiement externe, notifier Payment que c’est validé
    if ((process.env.USE_EXTERNAL_PAYMENT || '').toLowerCase() === 'true') {
      const adapters = createAdapters();
      try {
        await adapters.payment.notifyPaymentConfirmed(ticketIdNum, req.headers.authorization);
        logger.info('[VALIDATE CTRL] Notification envoyée à Payment', { ticketId: ticketIdNum });
      } catch (err) {
        logger.warn('[VALIDATE CTRL] Échec notification Payment', { ticketId: ticketIdNum, error: err.message });
        // On ne bloque pas la réponse au client
      }
    }

    return sendBusinessSuccess(res, 'VALIDATE_TICKET', updated);

  } catch (err) {
    logger.error('[VALIDATE CTRL] Error', { message: err.message });
    const code =
      err && err.statusCode
        ? err.statusCode
        : 'INTERNAL_SERVER_ERROR';
    return sendBusinessError(res, code);
  }
}

module.exports = { validateTicketController };
