// utils/verifyTicketHelper.js
const { verifyTicket } = require('../adapters/ticket.adapter');
const logger = require('./logger');
const { ERROR_STATUS } = require('./httpErrorMap');

/**
 * Vérifie et récupère un ticket depuis qrPayload
 * - Log complet pour traquer les erreurs
 * - Retourne un objet uniforme pour services start/confirm
 */
async function verifyTicketWithLogging(qrPayload, authHeader, serviceName) {
  const ticketIdRaw = qrPayload?.ticketId;
  const numericId = Number(ticketIdRaw);

  if (!numericId || Number.isNaN(numericId)) {
    const err = new Error('INVALID_TICKET_ID');
    err.statusCode = ERROR_STATUS.INVALID_TICKET_ID;
    logger.error(`[${serviceName}] Invalid ticketId`, { ticketIdRaw });
    throw err;
  }

  logger.info(`[${serviceName}] Verifying ticket ${numericId}`, { qrPayload });

  const jwtToken = authHeader?.replace(/^Bearer\s+/i, '');
  let verifiedTicket;

  try {
    verifiedTicket = await verifyTicket(qrPayload, jwtToken);
  } catch (err) {
    logger.error(`[${serviceName}] Error inside verifyTicket`, {
      ticketId: numericId,
      message: err.message,
      stack: err.stack,
      statusCode: err.statusCode || 500
    });
    throw err;
  }

  if (!verifiedTicket || !verifiedTicket.id) {
    const err = new Error('VERIFY_TICKET_FAILED');
    err.statusCode = ERROR_STATUS.TICKET_NOT_FOUND;
    logger.error(`[${serviceName}] Ticket verification returned invalid result`, { ticketId: numericId, result: verifiedTicket });
    throw err;
  }

  logger.info(`[${serviceName}] Ticket ${numericId} verified successfully`);

  return {
    ticketId: verifiedTicket.id,
    userId: verifiedTicket.userId,
    eventId: verifiedTicket.eventId,
    offerId: verifiedTicket.offerId,
    status: verifiedTicket.status,
    zone: verifiedTicket.zone,
    price: verifiedTicket.price,
    signature: verifiedTicket.signature,
    issuedAt: verifiedTicket.updatedAt
  };
}

module.exports = { verifyTicketWithLogging };
