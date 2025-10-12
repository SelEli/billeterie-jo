const crypto = require('crypto');
const prisma = require('../../utils/prismaClient');
const logger = require('../../utils/logger');
const axios = require('axios');
const { publishKafkaEvent } = require('../../utils/kafkaClient');
const { invalidateCachedTicket } = require('../../cache/ticket.cache');
const { ERROR_STATUS } = require('../../utils/httpErrorMap');

async function validateTicketService(ticketId, user) {
  logger.info('[SERVICE][VALIDATE] Entrée', { ticketId });

  const numericId = Number(ticketId);
  if (!numericId) {
    const err = new Error('INVALID_TICKET_ID');
    err.statusCode = ERROR_STATUS.INVALID_TICKET_ID;
    throw err;
  }

  const ticket = await prisma.ticket.findUnique({ where: { id: numericId } });
  if (!ticket) {
    const err = new Error('TICKET_NOT_FOUND');
    err.statusCode = ERROR_STATUS.TICKET_NOT_FOUND;
    throw err;
  }

  if (ticket.status !== 'RESERVED') {
    const err = new Error('INVALID_TICKET_STATUS');
    err.statusCode = ERROR_STATUS.INVALID_TICKET_STATUS;
    throw err;
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
    logger.info('[SERVICE][VALIDATE] Réponse User Service', res.data);
  } catch (err) {
    logger.warn('[SERVICE][VALIDATE] Impossible de récupérer invisibleKey', {
      ticketId: numericId,
      error: err.message
    });
  }

  if (!invisibleKey) {
    const err = new Error('USER_KEY_NOT_FOUND');
    err.statusCode = ERROR_STATUS.USER_KEY_NOT_FOUND || ERROR_STATUS.INTERNAL_SERVER_ERROR;
    throw err;
  }

  // 🔹 Signature calculée uniquement avec les deux clés
  const payloadToSign = `${ticket.secretKey}:${invisibleKey}`;
  const signature = crypto.createHmac('sha256', invisibleKey).update(payloadToSign).digest('hex');

  // 🔹 Mise à jour ticket
  const updated = await prisma.ticket.update({
    where: { id: numericId },
    data: { status: 'VALID', signature }
  });

  try {
    await invalidateCachedTicket(numericId);
    logger.debug('[SERVICE][VALIDATE] Cache invalidé', { id: numericId });
  } catch (err) {
    logger.warn('[SERVICE][VALIDATE] Erreur invalidation cache', {
      id: numericId,
      error: err.message
    });
  }

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
    logger.debug('[SERVICE][VALIDATE] Kafka event publié', { ticketId: updated.id });
  } catch (err) {
    logger.warn('[SERVICE][VALIDATE] Kafka publish échoué', {
      ticketId: numericId,
      error: err.message
    });
  }

  return updated;
}

module.exports = { validateTicketService };
