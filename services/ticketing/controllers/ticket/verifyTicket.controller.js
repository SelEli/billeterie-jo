// controllers/ticket/verifyTicket.controller.js
const { verifyTicketService } = require('../../services/ticket/verifyTicket.service');
const { sendBusinessError } = require('../../utils/sendError');
const { sendBusinessSuccess } = require('../../utils/sendSuccess');
const logger = require('../../utils/logger');
const axios = require('axios');

async function verifyTicketController(req, res) {
  // 🔎 LOG DEBUG INCOMING REQUEST
  logger.info('[VERIFY CTRL] Incoming request details', {
    method: req.method,
    url: req.originalUrl,
    headers: req.headers,
    body: req.body,
    query: req.query
  });

  try {
    const { ticketId } = req.body;
    const ticketIdNum = Number(ticketId);
    if (!ticketId || isNaN(ticketIdNum)) {
      return sendBusinessError(res, 'INVALID_TICKET_ID');
    }

    logger.info('[VERIFY CTRL] Vérification ticket', { ticketId: ticketIdNum });

    // 1️⃣ Vérifier le ticket (signature, statut, etc.)
    const updated = await verifyTicketService(req.body, req.headers.authorization);
    if (!updated) {
      return sendBusinessError(res, 'TICKET_NOT_FOUND');
    }

    // 2️⃣ Récupérer infos utilisateur associées
    let userInfo = null;
    try {
      const { data: userRes } = await axios.get(
        `${process.env.USER_URL}/${updated.userId}`,
        { headers: { Authorization: req.headers.authorization } }
      );
      userInfo = userRes?.data || null;
      logger.info('[VERIFY CTRL] Infos utilisateur récupérées', { userId: updated.userId });
    } catch (err) {
      logger.warn('[VERIFY CTRL] Impossible de récupérer infos utilisateur', {
        userId: updated.userId,
        error: err.message
      });
      // On ne bloque pas la vérification si l’info user est indispo
    }

    // 3️⃣ Réponse enrichie
    return sendBusinessSuccess(res, 'VERIFY_TICKET', {
      ticket: updated,
      user: userInfo
    });

  } catch (err) {
    logger.error('[VERIFY CTRL] Error', { message: err.message });
    const code = err && err.statusCode
      ? err.statusCode
      : 'INTERNAL_SERVER_ERROR';
    return sendBusinessError(res, code);
  }
}

module.exports = { verifyTicketController };
