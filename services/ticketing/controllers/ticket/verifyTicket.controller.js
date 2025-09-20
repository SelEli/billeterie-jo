const axios = require('axios');
const { requestVerification } = require('../../utils/kafkaConsumer');
const { sendBusinessError } = require('../../utils/sendError');
const { sendBusinessSuccess } = require('../../utils/sendSuccess');
const logger = require('../../utils/logger');

// Cache simple en mémoire : { userId: { role, expiresAt } }
const roleCache = new Map();
const CACHE_TTL_MS = 60_000; // 1 minute

async function verifyTicketController(req, res) {
  // 🔎 LOG DEBUG INCOMING REQUEST
  logger.info('[TICKET-SERVICE][VERIFY CTRL] Incoming request details', {
    method: req.method,
    url: req.originalUrl,
    headers: req.headers,
    body: req.body,
    query: req.query
  });

  try {
    // 1️⃣ Vérification authentification
    if (!req.user) {
      return sendBusinessError(res, 'FORBIDDEN');
    }

    // 2️⃣ Validation ticketId
    const { ticketId } = req.body;
    const ticketIdNum = Number(ticketId);
    if (!ticketId || isNaN(ticketIdNum)) {
      return sendBusinessError(res, 'INVALID_TICKET_ID');
    }

    const userId = req.user.userId;
    let role;

    // 3️⃣ Récupération rôle depuis cache ou Auth
    const cached = roleCache.get(userId);
    if (cached && cached.expiresAt > Date.now()) {
      role = cached.role;
    } else {
      try {
        const { data: profileRes } = await axios.get(
          `${process.env.USER_URL}/${userId}`,
          { headers: { Authorization: req.headers.authorization } }
        );
        role = profileRes?.data?.role || null;

        if (role) {
          roleCache.set(userId, { role, expiresAt: Date.now() + CACHE_TTL_MS });
        }
      } catch (authErr) {
        logger.warn('[TICKET-SERVICE][VERIFY CTRL] Échec récupération rôle utilisateur', {
          userId,
          error: authErr.message
        });
        return sendBusinessError(res, 'USER_NOT_FOUND');
      }
    }

    // 4️⃣ Vérification rôle autorisé (ADMIN, AGENT, EMPLOYEE)
    if (!['ADMIN', 'AGENT', 'EMPLOYEE'].includes(role)) {
      return sendBusinessError(res, 'FORBIDDEN');
    }

    // 5️⃣ Envoi de la demande de vérification via Kafka
    logger.info('[TICKET-SERVICE][VERIFY CTRL] Demande de vérification envoyée via Kafka', {
      ticketId: ticketIdNum,
      userId
    });

    await requestVerification(ticketIdNum);

    // 6️⃣ Réponse au client
    return sendBusinessSuccess(res, 'VERIFY_TICKET_REQUESTED', { ticketId: ticketIdNum });

  } catch (err) {
    logger.error('[TICKET-SERVICE][VERIFY CTRL] Error', { message: err.message });
    const code = err && err.statusCode
      ? err.statusCode
      : 'INTERNAL_SERVER_ERROR';
    return sendBusinessError(res, code);
  }
}

module.exports = { verifyTicketController };
