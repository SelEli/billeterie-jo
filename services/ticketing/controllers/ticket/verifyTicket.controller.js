// controllers/ticket/verifyTicket.controller.js
const { verifyTicketService } = require('../../services/ticket/verifyTicket.service');
const { sendBusinessError } = require('../../utils/sendError');
const { sendBusinessSuccess } = require('../../utils/sendSuccess');
const logger = require('../../utils/logger');
const axios = require('axios');

async function verifyTicketController(req, res) {
  logger.info('[VERIFY CTRL] Incoming request', {
    method: req.method,
    url: req.originalUrl,
    headers: req.headers,
    body: req.body,
    query: req.query
  });

  try {
    const { ticketId, signature } = req.body;
    const ticketIdNum = Number(ticketId);

    if (!ticketId || isNaN(ticketIdNum)) {
      return sendBusinessError(res, 'INVALID_TICKET_ID');
    }
    if (!signature) {
      return sendBusinessError(res, 'MISSING_SIGNATURE');
    }

    logger.info('[VERIFY CTRL] Vérification ticket', { ticketId: ticketIdNum });

    // 🔹 Vérification ticket via service (signature, statut, etc.)
    const updatedTicket = await verifyTicketService(req.body, req.headers.authorization);
    if (!updatedTicket) {
      return sendBusinessError(res, 'TICKET_NOT_FOUND');
    }

    // 🔹 Récupérer infos utilisateur associées (optionnel)
    let userInfo = null;
    try {
      const { data: userRes } = await axios.get(
        `${process.env.USER_URL}/${updatedTicket.userId}`,
        { headers: req.headers.authorization ? { Authorization: req.headers.authorization } : {} }
      );
      userInfo = userRes?.data || null;
      logger.info('[VERIFY CTRL] Infos utilisateur récupérées', { userId: updatedTicket.userId });
    } catch (err) {
      logger.warn('[VERIFY CTRL] Impossible de récupérer infos utilisateur', {
        userId: updatedTicket.userId,
        error: err.message
      });
    }

    // 🔹 Réponse enrichie
    return sendBusinessSuccess(res, 'VERIFY_TICKET_SUCCESS', {
      ticket: updatedTicket,
      user: userInfo
    });

  } catch (err) {
    logger.error('[VERIFY CTRL] Error', { message: err.message, stack: err.stack });
    const code = err?.statusCode || 'INTERNAL_SERVER_ERROR';
    return sendBusinessError(res, code);
  }
}

module.exports = { verifyTicketController };
