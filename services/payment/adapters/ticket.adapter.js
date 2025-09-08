const axios = require('axios');
const logger = require('../utils/logger');

async function validateTicket(ticketId, jwtToken) {
  try {
    const res = await axios.post(
      `${process.env.TICKET_API_URL}/ticket/validate`,
      { ticketId },
      { headers: { Authorization: `Bearer ${jwtToken}` } }
    );
    return res.data;
  } catch (err) {
    logger.error('[TICKET ADAPTER] Erreur appel ticket-service:', err.message);
    throw err;
  }
}

module.exports = { validateTicket };
