const crypto = require('crypto');
const axios = require('axios');
const prisma = require('../../utils/prismaClient');
const logger = require('../../utils/logger');
const { publishKafkaEvent } = require('../../utils/kafkaClient');
const { ERROR_STATUS } = require('../../utils/httpErrorMap');
const { invalidateCachedTicket } = require('../../cache/ticket.cache');

/**
 * Vérifie un ticket scanné et le marque comme USED
 * - Compare la signature du QR code avec celle recalculée côté serveur
 * - Marque le ticket comme USED si tout est OK
 */
async function verifyTicketService(qrPayload, authHeader) {
  const {
    ticketId,
    eventId,
    userId,
    zone,
    price,
    issuedAt,
    signature
  } = qrPayload;

  // Charger le ticket depuis la base
  const ticket = await prisma.ticket.findUnique({ where: { id: ticketId } });
  if (!ticket) {
    const err = new Error('TICKET_NOT_FOUND');
    err.statusCode = ERROR_STATUS.TICKET_NOT_FOUND;
    throw err;
  }

  // Vérifier statut
  if (['USED', 'EXPIRED'].includes(ticket.status)) {
    logger.info(`[TICKET SERVICE][VERIFY] Ticket ${ticketId} already ${ticket.status}`);
    return ticket;
  }
  if (ticket.status !== 'VALID') {
    const err = new Error('TICKET_NOT_VALID');
    err.statusCode = ERROR_STATUS.TICKET_NOT_VALID;
    throw err;
  }

  // Récupérer invisibleKey depuis Auth pour l'utilisateur du ticket
  let invisibleKey;
  try {
    const res = await axios.get(`${process.env.USER_URL}/${ticket.userId}`, {
      headers: { Authorization: authHeader }
    });
    invisibleKey = res.data?.data?.invisibleKey;
  } catch (err) {
    logger.warn(`[VERIFY SERVICE] Impossible de récupérer invisibleKey: ${err.message}`);
  }
  if (!invisibleKey) {
    const e = new Error('USER_KEY_NOT_FOUND');
    e.statusCode = ERROR_STATUS.USER_KEY_NOT_FOUND;
    throw e;
  }

  // Recalculer la signature attendue
  const payloadToSign = `${ticket.secretKey}:${invisibleKey}:${ticket.id}:${ticket.eventId}:${ticket.userId}:${ticket.zone}:${ticket.price}:${ticket.updatedAt.toISOString()}`;
  const expectedSignature = crypto
    .createHmac('sha256', invisibleKey)
    .update(payloadToSign)
    .digest('hex');

  // Comparer avec la signature du QR code
  if (signature !== expectedSignature) {
    const err = new Error('INVALID_SIGNATURE');
    err.statusCode = ERROR_STATUS.INVALID_SIGNATURE;
    throw err;
  }

  // Tout est OK → marquer comme USED
  const updated = await prisma.ticket.update({
    where: { id: ticketId },
    data: { status: 'USED' }
  });

  // Invalidation cache
  await invalidateCachedTicket(ticketId);

  logger.info(`[TICKET SERVICE][VERIFY] Ticket ${ticketId} marked as USED`);

  try {
    await publishKafkaEvent('ticket', {
      type: 'TicketVerified',
      ticketId: updated.id,
      userId: updated.userId,
      eventId: updated.eventId,
      offerId: updated.offerId,
      status: updated.status
    });
    logger.debug(`[TICKET SERVICE][VERIFY] Kafka event TicketVerified published for ticket ${ticketId}`);
  } catch (err) {
    logger.warn(`[TICKET SERVICE][VERIFY] Kafka publish failed: ${err.message}`);
  }

  return updated;
}

module.exports = { verifyTicketService };
