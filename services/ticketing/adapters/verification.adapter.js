// adapters/verification.adapter.js
// 🛡️ Adapter Verification (on-site check)
// - mode: 'mock' | 'live'
// - live: POST VERIFICATION_URL { ticketId } (cookie attendu)
// - mock: renvoie un succès formaté (USED)
// - inclut aussi la notification post-vérification (callback) avec VERIFY_CALLBACK_URL ou mock

const axios = require('axios');
const logger = require('../utils/logger');

module.exports = function createVerificationAdapter({ mode = 'live' } = {}) {
  async function requestTicketVerification(ticketId, cookie) {
    if (mode === 'mock') {
      logger.debug('[VERIFICATION ADAPTER] Mock verification', { ticketId });
      return {
        status: 'success',
        data: { ticketId, status: 'USED', valid: true },
        errors: [],
        meta: { timestamp: new Date().toISOString(), mode: 'mock' }
      };
    }

    const baseUrl = process.env.VERIFICATION_URL;
    if (!baseUrl) throw new Error('VERIFICATION_URL non défini');

    const url = `${baseUrl.replace(/\/$/, '')}`;
    logger.debug('[VERIFICATION ADAPTER] Requesting verification', { ticketId });

    const res = await axios.post(
      url,
      { ticketId },
      {
        headers: cookie ? { cookie } : {},
        withCredentials: true
      }
    );
    return res.data;
  }

  async function notifyTicketVerified(ticket) {
    if (mode === 'mock') {
      logger.debug('[VERIFICATION ADAPTER] Mock notify', { ticketId: ticket.id });
      return { status: 'mocked', ticketId: ticket.id, meta: { mode: 'mock' } };
    }

    const baseUrl = process.env.VERIFY_CALLBACK_URL;
    if (!baseUrl) throw new Error('VERIFY_CALLBACK_URL non défini');

    const url = `${baseUrl.replace(/\/$/, '')}`;
    try {
      const res = await axios.post(url, ticket);
      logger.info('[VERIFICATION ADAPTER] Callback envoyé', { ticketId: ticket.id });
      return res.data;
    } catch (err) {
      logger.warn('[VERIFICATION ADAPTER] Callback échec', {
        ticketId: ticket.id,
        error: err.message
      });
      // Non bloquant
      return { status: 'failed', error: err.message };
    }
  }

  return { requestTicketVerification, notifyTicketVerified };
};
