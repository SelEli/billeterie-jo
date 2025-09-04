// services/ticket/verifyTicket.service.js
const axios = require('axios');
const prisma = require('../../utils/prismaClient');
const logger = require('../../utils/logger');
const { publishKafkaEvent } = require('../../utils/kafkaClient');
const { ERROR_STATUS } = require('../../utils/httpErrorMap');

/**
 * Vérifie un ticket et le marque comme USED (ou autre statut final)
 * - Vérification de l'utilisateur via Auth (/user/:id pour internes, /auth/profile pour publics)
 */
async function verifyTicketService(ticketId, userId, role, authHeader) {
  // Vérif Auth
  let found = null;
  try {
    if (['ADMIN', 'AGENT', 'EMPLOYEE'].includes(role)) {
      const res = await axios.get(`${process.env.USER_URL}/${userId}`, {
        headers: { Authorization: authHeader }
      });
      if (res.data?.data) found = res.data.data;
    } else {
      const res = await axios.get(`${process.env.AUTH_URL}/profile`, {
        headers: { Authorization: authHeader }
      });
      if (res.data?.data) found = res.data.data;
    }
  } catch (err) {
    logger.warn(`[VERIFY SERVICE] Auth check failed: ${err.message}`);
  }
  if (!found) {
    const e = new Error('USER_NOT_FOUND');
    e.statusCode = ERROR_STATUS.USER_NOT_FOUND;
    throw e;
  }

  // Vérif ticket
  const numericId = typeof ticketId === 'string' ? Number(ticketId) : ticketId;
  const ticket = await prisma.ticket.findUnique({ where: { id: numericId } });
  if (!ticket) {
    const err = new Error('TICKET_NOT_FOUND');
    err.statusCode = ERROR_STATUS.TICKET_NOT_FOUND;
    throw err;
  }

  if (['USED', 'EXPIRED'].includes(ticket.status)) {
    logger.info(`[TICKET SERVICE][VERIFY] Ticket ${numericId} already ${ticket.status}`);
    return ticket;
  }

  if (ticket.status !== 'VALID') {
    const err = new Error('TICKET_NOT_VALID');
    err.statusCode = ERROR_STATUS.TICKET_NOT_VALID;
    throw err;
  }

  const updated = await prisma.ticket.update({
    where: { id: numericId },
    data: { status: 'USED' }
  });

  logger.info(`[TICKET SERVICE][VERIFY] Ticket ${numericId} marked as USED`);

  try {
    await publishKafkaEvent('ticketing', {
      type: 'TicketVerified',
      ticketId: updated.id,
      userId: updated.userId,
      eventId: updated.eventId,
      offerId: updated.offerId,
      status: updated.status
    });
    logger.debug(`[TICKET SERVICE][VERIFY] Kafka event TicketVerified published for ticket ${numericId}`);
  } catch (err) {
    logger.warn(`[TICKET SERVICE][VERIFY] Kafka publish failed: ${err.message}`);
  }

  return updated;
}

module.exports = { verifyTicketService };