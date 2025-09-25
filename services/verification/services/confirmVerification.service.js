// services/confirmVerificationService.js
const { verifyTicket } = require('../adapters/ticket.adapter');
const logger = require('../utils/logger');
const { ERROR_STATUS } = require('../utils/httpErrorMap');

async function confirmVerificationService(qrPayload, authHeader) {
  const ticketId = qrPayload?.ticketId;
  if (!ticketId) {
    const err = new Error('INVALID_TICKET_ID');
    err.statusCode = ERROR_STATUS.INVALID_TICKET_ID;
    throw err;
  }

  logger.info(`[CONFIRM VERIFICATION SERVICE] Ticket ${ticketId}`);

  const jwtToken = authHeader?.replace(/^Bearer\s+/i, '');
  return await verifyTicket(qrPayload, jwtToken);
}

module.exports = { confirmVerificationService };
