// controllers/ticket/validateTicket.controller.js
const { createAdapters } = require('../../adapters');
const {
  validateTicketService,
  PAYMENT_SERVICE_USER_ID
} = require('../../services/ticket/validateTicket.service');
const { sendBusinessError } = require('../../utils/sendError');
const { sendBusinessSuccess } = require('../../utils/sendSuccess');
const logger = require('../../utils/logger');

async function validateTicketController(req, res) {
  try {
    // Autorisation : rôle PAYMENT ou AGENT avec l'ID technique Payment
    if (
      !req.user ||
      !(
        req.user.role === 'PAYMENT' ||
        (req.user.role === 'AGENT' &&
          req.user.userId === Number(PAYMENT_SERVICE_USER_ID))
      )
    ) {
      return sendBusinessError(res, 'FORBIDDEN');
    }

    const { ticketId } = req.body;
    const ticketIdNum = Number(ticketId);
    if (!ticketId || isNaN(ticketIdNum)) {
      return sendBusinessError(res, 'INVALID_TICKET_ID');
    }

    logger.info('[VALIDATE CTRL] Validation ticket', {
      ticketId: ticketIdNum,
      userId: req.user.userId
    });

    // 1️⃣ Valider le ticket localement (avec signature)
    const updated = await validateTicketService(
      ticketIdNum,
      req.user.userId,
      req.user.role,
      req.headers.authorization // 🔹 ajouté pour Auth
    );

    if (!updated) {
      return sendBusinessError(res, 'TICKET_NOT_FOUND');
    }

    // 2️⃣ Si paiement externe, notifier Payment que c’est validé
    if ((process.env.USE_EXTERNAL_PAYMENT || '').toLowerCase() === 'true') {
      const adapters = createAdapters();
      try {
        await adapters.payment.notifyPaymentConfirmed(
          ticketIdNum,
          req.headers.authorization
        );
        logger.info('[VALIDATE CTRL] Notification envoyée à Payment', {
          ticketId: ticketIdNum
        });
      } catch (err) {
        logger.warn('[VALIDATE CTRL] Échec notification Payment', {
          ticketId: ticketIdNum,
          error: err.message
        });
        // On ne bloque pas la réponse au client
      }
    }

    return sendBusinessSuccess(res, 'VALIDATE_TICKET', updated);
  } catch (err) {
    logger.error('[VALIDATE CTRL] Error', { message: err.message });
    const code =
      err &&
      err.message &&
      err.message in require('../../utils/httpErrorMap').ERROR_STATUS
        ? err.message
        : 'INTERNAL_SERVER_ERROR';
    return sendBusinessError(res, code);
  }
}

module.exports = { validateTicketController };
