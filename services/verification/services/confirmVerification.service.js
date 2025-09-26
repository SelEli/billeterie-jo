// services/confirmVerificationService.js
const { verifyTicketWithLogging } = require('../utils/verifyTicketHelper');

async function confirmVerificationService(qrPayload, authHeader) {
  return verifyTicketWithLogging(qrPayload, authHeader, 'CONFIRM VERIFICATION SERVICE');
}

module.exports = { confirmVerificationService };
