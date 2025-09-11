// controllers/ticket/verifyTicket.controller.js
const axios = require('axios');
const { requestVerification } = require('../../utils/kafkaConsumer');
const { sendBusinessError } = require('../../utils/sendError');
const { sendBusinessSuccess } = require('../../utils/sendSuccess');
const logger = require('../../utils/logger');

// Cache simple en mémoire : { userId: { role, expiresAt } }
const roleCache = new Map();
const CACHE_TTL_MS = 60_000; // 1 minute

async function verifyTicketController(req, res) {
  try {
    if (!req.user) {
      return sendBusinessError(res, 'FORBIDDEN');
    }

    const { ticketId } = req.body;
    const ticketIdNum = Number(ticketId);
    if (!ticketId || isNaN(ticketIdNum)) {
      return sendBusinessError(res, 'INVALID_TICKET_ID');
    }

    const userId = req.user.userId;
    let role;

    // 🔹 Vérifie si le rôle est en cache et encore valide
    const cached = roleCache.get(userId);
    if (cached && cached.expiresAt > Date.now()) {
      role = cached.role;
    } else {
      try {
        // 🔹 Récupère depuis Auth
        const { data: profileRes } = await axios.get(
          `${process.env.USER_URL}/${userId}`,
          { headers: { Authorization: req.headers.authorization } }
        );
        role = profileRes?.data?.role || null;

        // 🔹 Met en cache si trouvé
        if (role) {
          roleCache.set(userId, { role, expiresAt: Date.now() + CACHE_TTL_MS });
        }
      } catch (authErr) {
        logger.warn('[VERIFY CTRL] Échec récupération rôle utilisateur', {
          userId,
          error: authErr.message
        });
        return sendBusinessError(res, 'USER_NOT_FOUND');
      }
    }

    // 🔹 Vérifie que le rôle est autorisé
    if (!['AGENT', 'EMPLOYEE'].includes(role)) {
      return sendBusinessError(res, 'FORBIDDEN');
    }

    // 🔹 Envoi de la demande de vérification via Kafka
    logger.info('[VERIFY CTRL] Demande de vérification envoyée via Kafka', {
      ticketId: ticketIdNum,
      userId
    });

    await requestVerification(ticketIdNum);

    // 🔹 Réponse immédiate au client
    return sendBusinessSuccess(res, 'VERIFY_TICKET_REQUESTED', { ticketId: ticketIdNum });
  } catch (err) {
    logger.error('[VERIFY CTRL] Error', { message: err.message });
    const code =
      err &&
      err.message &&
      err.message in require('../../utils/httpErrorMap').ERROR_STATUS
        ? err.message
        : 'INTERNAL_SERVER_ERROR';
    return sendBusinessError(res, code);
  }
}

module.exports = { verifyTicketController };
