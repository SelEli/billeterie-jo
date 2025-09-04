// adapters/verification.adapter.js
// 🛡️ Adapter Verification (on-site check)
// - mode: 'mock' | 'live'
// - live: POST VERIFICATION_URL { ticketId } (JWT attendu)
// - mock: renvoie un succès formaté (USED)
// - inclut aussi la notification post-vérification (callback) avec VERIFY_CALLBACK_URL ou mock

const axios = require('axios');
const logger = require('../utils/logger');

module.exports = function createVerificationAdapter({ mode = 'live' } = {}) {
  async function requestTicketVerification(ticketId, authHeader) {
    if (mode === 'mock') {
      logger.debug('[VERIFICATION ADAPTER] Mock verification');
      return {
        status: 'success',
        data: { ticketId, status: 'USED', valid: true },
        errors: [],
        meta: { timestamp: new Date().toISOString(), mode: 'mock' }
      };
    }

    const url = process.env.VERIFICATION_URL;
    if (!url) throw new Error('VERIFICATION_URL non défini');

    const res = await axios.post(
      url,
      { ticketId },
      { headers: { Authorization: authHeader } }
    );
    return res.data;
  }

  async function notifyTicketVerified(ticket) {
    if (mode === 'mock') {
      logger.debug('[VERIFICATION ADAPTER] Mock notify');
      return { status: 'mocked', ticketId: ticket.id, meta: { mode: 'mock' } };
    }

    const url = process.env.VERIFY_CALLBACK_URL;
    if (!url) throw new Error('VERIFY_CALLBACK_URL non défini');

    try {
      const res = await axios.post(url, ticket);
      logger.info(`[VERIFICATION ADAPTER] Callback envoyé ticket=${ticket.id}`);
      return res.data;
    } catch (err) {
      logger.warn(`[VERIFICATION ADAPTER] Callback échec: ${err.message}`);
      // Non bloquant
      return { status: 'failed', error: err.message };
    }
  }

  return { requestTicketVerification, notifyTicketVerified };
};
