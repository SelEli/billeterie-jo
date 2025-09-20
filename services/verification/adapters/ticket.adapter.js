const axios = require('axios');
const logger = require('../utils/logger');

/**
 * Appelle l'API du ticket-service pour vérifier un ticket (jour J).
 * @param {object} qrPayload - Données du QR code (ticketId, eventId, userId, zone, price, issuedAt, signature)
 * @param {string} jwtToken - JWT d'authentification
 * @returns {Promise<object>} - Réponse du ticket-service
 */
async function verifyTicket(qrPayload, jwtToken) {
  try {
    const res = await axios.post(
      `${process.env.TICKET_API_URL}/ticket/verify`,
      qrPayload,
      { headers: { Authorization: `Bearer ${jwtToken}` } }
    );
    logger.info(`[TICKET ADAPTER] Ticket ${qrPayload.ticketId} vérifié via API ticket-service`);
    return res.data;
  } catch (err) {
    logger.error('[TICKET ADAPTER] Erreur appel ticket-service (verify):', err.message);
    throw err;
  }
}

/**
 * (Optionnel) Appelle l'API du ticket-service pour pré‑vérifier un ticket.
 * @param {number} ticketId - ID du ticket à pré‑vérifier
 * @param {string} jwtToken - JWT d'authentification
 * @returns {Promise<object>} - Réponse du ticket-service
 */
async function startVerifyTicket(ticketId, jwtToken) {
  try {
    const res = await axios.get(
      `${process.env.TICKET_API_URL}/ticket/start-verify/${ticketId}`,
      { headers: { Authorization: `Bearer ${jwtToken}` } }
    );
    logger.info(`[TICKET ADAPTER] Pré‑vérification ticket ${ticketId} via API ticket-service`);
    return res.data;
  } catch (err) {
    logger.error('[TICKET ADAPTER] Erreur appel ticket-service (start-verify):', err.message);
    throw err;
  }
}

module.exports = { verifyTicket, startVerifyTicket };
