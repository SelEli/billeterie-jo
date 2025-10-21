// adapters/payment.adapter.js
// 💳 Adapter Payment (validate)
// - mode: 'mock' | 'live'
// - live: POST PAYMENT_URL { ticketId } (cookie attendu)
// - mock: renvoie un succès formaté (VALID)

const axios = require('axios');
const logger = require('../utils/logger');

module.exports = function createPaymentAdapter({ mode = 'live' } = {}) {
  async function requestTicketValidation(ticketId, cookie) {
    if (mode === 'mock') {
      logger.debug('[PAYMENT ADAPTER] Mock mode');
      return {
        status: 'success',
        data: { ticketId, status: 'VALID' },
        errors: [],
        meta: { timestamp: new Date().toISOString(), mode: 'mock' }
      };
    }

    const url = process.env.PAYMENT_URL;
    if (!url) throw new Error('PAYMENT_URL non défini');

    const res = await axios.post(
      url,
      { ticketId },
      {
        headers: cookie ? { cookie } : {},
        withCredentials: true
      }
    );

    // On normalise au format interne si besoin
    return res.data;
  }

  return { requestTicketValidation };
};
