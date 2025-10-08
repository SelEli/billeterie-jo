const crypto = require('crypto');
const prisma = require('../../utils/prismaClient');
const logger = require('../../utils/logger');
const axios = require('axios');
const { publishKafkaEvent } = require('../../utils/kafkaClient');
const { invalidateCachedTicket } = require('../../cache/ticket.cache');

async function validateTicketService(ticketId, user) {
  logger.info('[TICKET SERVICE] Ticket validation called', { ticketId });

  const numericId = Number(ticketId);
  if (!numericId) {
    throw new Error('INVALID_TICKET_ID');
  }

  const ticket = await prisma.ticket.findUnique({ where: { id: numericId } });
  if (!ticket) {
    throw new Error('TICKET_NOT_FOUND');
  }

  if (ticket.status !== 'RESERVED') {
    throw new Error('INVALID_TICKET_STATUS');
  }

  // 🔹 Récupération de la clé utilisateur via User Service
  let invisibleKey;
  try {
    const res = await axios.get(`${process.env.USER_URL}/${ticket.userId}`, {
      headers: {
        ...(user?.token ? { Authorization: `Bearer ${user.token}` } : {}),
        ...(user?.cookie ? { cookie: user.cookie } : {})
      },
      withCredentials: true
    });
    invisibleKey = res.data?.data?.invisibleKey;
    logger.info('[TICKET SERVICE] Réponse User Service', res.data);
  } catch (err) {
    logger.warn(`[TICKET SERVICE] Impossible de récupérer invisibleKey: ${err.message}`, { ticketId });
  }

  if (!invisibleKey) {
    throw new Error('USER_KEY_NOT_FOUND');
  }

  // 🔹 Signature calculée uniquement avec les deux clés
  const payloadToSign = `${ticket.secretKey}:${invisibleKey}`;
  const signature = crypto.createHmac('sha256', invisibleKey).update(payloadToSign).digest('hex');

  // 🔹 Mise à jour ticket
  const updated = await prisma.ticket.update({
    where: { id: numericId },
    data: { status: 'VALID', signature }
  });

  await invalidateCachedTicket(numericId);

  // 🔹 Publication Kafka
  try {
    await publishKafkaEvent('ticket', {
      type: 'TicketValidated',
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

module.exports = { validateTicketService };
