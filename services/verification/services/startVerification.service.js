const crypto = require('crypto');
const axios = require('axios');
const logger = require('../utils/logger');
const { publishKafkaEvent } = require('../utils/kafkaClient');
const { success, error } = require('../utils/response');

/**
 * Démarre la vérification d'un ticket
 * @param {object} payload - { ticketId, signature }
 * @param {string|null} authHeader
 */
async function startVerificationService(payload, authHeader = null) {
  const { ticketId, signature } = payload;
  const numericId = Number(ticketId);

  if (!numericId) return error(['INVALID_TICKET_ID']);
  if (!signature) return error(['MISSING_SIGNATURE']);

  try {
    // 🔹 Lecture ticket complet depuis le Ticket Service (avec includeSecret=true)
    const ticketRes = await axios.get(
      `${process.env.TICKET_URL}/${numericId}?includeSecret=true`,
      { headers: authHeader ? { Authorization: authHeader } : {} }
    );
    const ticket = ticketRes.data?.data;

    if (!ticket || ticket.status !== 'VALID') {
      return error(['TICKET_NOT_VALID']);
    }

    // 🔹 Récupération clé invisible de l’utilisateur
    const userRes = await axios.get(`${process.env.USER_URL}/${ticket.userId}`, {
      headers: authHeader ? { Authorization: authHeader } : {}
    });
    const invisibleKey = userRes.data?.data?.invisibleKey;
    if (!invisibleKey) return error(['USER_KEY_NOT_FOUND']);

    // 🔹 Vérification signature HMAC
    const payloadToSign = `${ticket.secretKey}:${invisibleKey}`;
    const expectedSignature = crypto
      .createHmac('sha256', invisibleKey)
      .update(payloadToSign)
      .digest('hex');

    // 👉 Logs détaillés
    console.log('>>> [SIGNATURE CHECK]');
    console.log('Payload utilisé pour signer :', payloadToSign);
    console.log('Signature attendue (server) :', expectedSignature);
    console.log('Signature reçue (client)    :', signature);
    console.log('Comparaison                 :', signature === expectedSignature);

    if (signature !== expectedSignature) {
      return error(['INVALID_SIGNATURE']);
    }

    // 🔹 Réponse immédiate au front (sans status)
    const response = success({ ticketId: numericId });
    logger.info('[VERIFICATION SERVICE] Ticket validé', { ticketId: numericId });

    // 🔹 Publication Kafka (sans status)
    publishKafkaEvent('ticket', {
      type: 'TicketVerificationStarted',
      ticketId: numericId,
      userId: ticket.userId,
      mode: 'live'
    }).catch(err => logger.warn('Kafka publish failed', { error: err.message }));

    // 🔹 Mise à jour asynchrone côté Ticket → passage en USED
    axios.post(
      `${process.env.TICKET_URL}/verify`,
      { ticketId: Number(numericId) },
      {
        headers: {
          ...(authHeader ? { Authorization: authHeader } : {}),
          'Content-Type': 'application/json'
        }
      }
    )
    .then(res => {
      logger.info('[VERIFICATION SERVICE] Ticket marqué USED côté Ticket Service', {
        ticketId: numericId,
        response: res.data
      });
    })
    .catch(err => {
      logger.error('[VERIFICATION SERVICE] Ticket update failed', {
        ticketId: numericId,
        error: err.message,
        status: err.response?.status,
        data: err.response?.data
      });
    });

    return response;

  } catch (err) {
    logger.error('[VERIFICATION SERVICE] Erreur startVerification', { error: err.message });
    return error([err.message], err.statusCode || 500);
  }
}

module.exports = { startVerificationService };
