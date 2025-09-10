// adapters/ticket.adapter.js
const axios = require('axios');
const logger = require('../utils/logger');

/**
 * Appelle l'API du ticket-service pour valider un ticket.
 * @param {number} ticketId - ID du ticket à valider
 * @param {string} jwtToken - JWT d'authentification
 * @returns {Promise<object>} - Réponse du ticket-service
 */
async function validateTicket(ticketId, jwtToken) {
  try {
    const res = await axios.post(
      `${process.env.TICKET_API_URL}/ticket/validate`,
      { ticketId },
      { headers: { Authorization: `Bearer ${jwtToken}` } }
    );
    logger.info(`[TICKET ADAPTER] Ticket ${ticketId} validé via API ticket-service`);
    return res.data;
  } catch (err) {
    logger.error('[TICKET ADAPTER] Erreur appel ticket-service:', err.message);
    throw err;
  }
}

module.exports = { validateTicket };
