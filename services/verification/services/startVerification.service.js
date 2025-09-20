const { startCheckTicket } = require('../adapters/ticket.adapter');
const logger = require('../utils/logger');
const { ERROR_STATUS } = require('../utils/httpErrorMap');

async function startVerificationService(ticketId, authHeader) {
  if (!ticketId) {
    const err = new Error('INVALID_TICKET_ID');
    err.statusCode = ERROR_STATUS.INVALID_TICKET_ID;
    throw err;
  }
  logger.info(`[START VERIFICATION SERVICE] Ticket ${ticketId}`);
  const jwtToken = authHeader?.replace(/^Bearer\s+/i, '');
  return await startCheckTicket(ticketId, jwtToken);
}

module.exports = { startVerificationService };
