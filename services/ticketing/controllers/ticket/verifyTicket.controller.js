// controllers/ticket/verifyTicket.controller.js
const axios = require('axios');
const { createAdapters } = require('../../adapters');
const { verifyTicketService } = require('../../services/ticket/verifyTicket.service');
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
    if (!ticketId || isNaN(Number(ticketId))) {
      return sendBusinessError(res, 'INVALID_TICKET_ID');
    }

    const userId = req.user.userId;
    let role;

    // 🔹 Vérifie si le rôle est en cache et encore valide
    const cached = roleCache.get(userId);
    if (cached && cached.expiresAt > Date.now()) {
      role = cached.role;
    } else {
      // 🔹 Sinon, récupère depuis Auth
      const { data: profileRes } = await axios.get(
        `${process.env.USER_URL}/${userId}`,
        { headers: { Authorization: req.headers.authorization } }
      );
      role = profileRes?.data?.role;

      // 🔹 Met en cache
      roleCache.set(userId, { role, expiresAt: Date.now() + CACHE_TTL_MS });
    }

    if (!['AGENT', 'EMPLOYEE'].includes(role)) {
      return sendBusinessError(res, 'FORBIDDEN');
    }

    logger.info('[VERIFY CTRL] Vérification interne');
    const updated = await verifyTicketService(
      Number(ticketId),
      userId,
      role, // rôle issu d’Auth ou du cache
      req.headers.authorization
    );

    if (!updated) {
      return sendBusinessError(res, 'TICKET_NOT_FOUND');
    }

    const adapters = createAdapters();
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
