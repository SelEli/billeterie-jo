const crypto = require('crypto');
const prisma = require('../../utils/prismaClient');
const axios = require('axios');
const logger = require('../../utils/logger');
const { publishKafkaEvent } = require('../../utils/kafkaClient');
const { ERROR_STATUS } = require('../../utils/httpErrorMap');
const { invalidateCachedTicket } = require('../../cache/ticket.cache');

async function verifyTicketService(ticketId, authHeader) {
  const numericId = Number(ticketId);
  if (!numericId) throw Object.assign(new Error('INVALID_TICKET_ID'), { statusCode: ERROR_STATUS.INVALID_TICKET_ID });

  const ticket = await prisma.ticket.findUnique({ where: { id: numericId } });
  if (!ticket) throw Object.assign(new Error('TICKET_NOT_FOUND'), { statusCode: ERROR_STATUS.TICKET_NOT_FOUND });

  if (['USED', 'EXPIRED'].includes(ticket.status)) return ticket;
  if (ticket.status !== 'VALID') throw Object.assign(new Error('TICKET_NOT_VALID'), { statusCode: ERROR_STATUS.TICKET_NOT_VALID });

  // Récupération invisibleKey
  let invisibleKey;
  try {
    const res = await axios.get(`${process.env.USER_URL}/${ticket.userId}`, {
      headers: authHeader ? { Authorization: authHeader } : {}
    });
    invisibleKey = res.data?.data?.invisibleKey;
  } catch {
    throw Object.assign(new Error('USER_KEY_NOT_FOUND'), { statusCode: ERROR_STATUS.USER_KEY_NOT_FOUND });
  }

  // Recalcul signature côté serveur
  const payloadToSign = `${ticket.secretKey}:${invisibleKey}`;
  const expectedSignature = crypto.createHmac('sha256', invisibleKey).update(payloadToSign).digest('hex');

  if (ticket.signature !== expectedSignature) throw Object.assign(new Error('INVALID_SIGNATURE'), { statusCode: ERROR_STATUS.INVALID_SIGNATURE });

  // Tout est OK → marquer USED
  const updated = await prisma.ticket.update({
    where: { id: numericId },
    data: { status: 'USED' }
  });

  await invalidateCachedTicket(numericId);

  // Publication Kafka
  try {
    await publishKafkaEvent('ticket', {
      type: 'TicketVerified',
      ticketId: updated.id,
      userId: updated.userId,
      eventId: updated.eventId,
      offerId: updated.offerId,
      status: updated.status
    });
  } catch (err) {
    logger.warn(`[TICKET SERVICE] Kafka publish failed: ${err.message}`, { ticketId: numericId });
  }

  return updated;
}

module.exports = { verifyTicketService };
