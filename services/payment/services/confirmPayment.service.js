const axios = require('axios');
const jwt = require('jsonwebtoken');
const { publishKafkaEvent } = require('../utils/kafkaClient');
const logger = require('../utils/logger');
const { ERROR_STATUS } = require('../utils/httpErrorMap');
const { getPaymentData, clearPaymentData } = require('../utils/paymentCache');

async function confirmPaymentService(ticketId, isMock = false) {
  const numericId = Number(ticketId);
  if (!numericId) {
    const err = new Error('INVALID_TICKET_ID');
    err.statusCode = ERROR_STATUS.INVALID_TICKET_ID;
    throw err;
  }

  logger.info(`[PAYMENT SERVICE] Confirmation paiement pour ticket ${numericId} (mock=${isMock})`);

  // 🔐 Token technique AGENT
  const token = jwt.sign(
    {
      userId: Number(process.env.PAYMENT_SERVICE_USER_ID),
      role: 'AGENT'
    },
    process.env.JWT_SECRET,
    { expiresIn: '5m' }
  );

  // 💾 Lecture du cache
  let paymentInfo = getPaymentData(numericId);
  let amount = paymentInfo?.amount ?? null;
  let mode = paymentInfo?.mode ?? (isMock ? 'mock' : 'live');

  // Fallback si cache vide ou expiré
  if (amount === null) {
    try {
      const ticketResp = await axios.get(
        `${process.env.TICKET_URL}/${numericId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      amount = ticketResp.data?.data?.price ?? null;
    } catch (err) {
      logger.warn(`[PAYMENT SERVICE] Impossible de récupérer le prix du ticket ${numericId} : ${err.message}`);
    }
  }

  // ✅ Appel à l’API ticket-service pour valider le ticket
  const resp = await axios.post(
    `${process.env.TICKET_URL}/validate`,
    { ticketId: numericId },
    { headers: { Authorization: `Bearer ${token}` } }
  );

  const ticketStatus = resp.data?.data?.status || resp.data?.status;
  if (ticketStatus !== 'VALID') {
    logger.error(`[PAYMENT SERVICE] Ticket ${numericId} non validé côté ticket-service`, resp.data);
    const err = new Error('TICKET_NOT_VALIDATED');
    err.statusCode = ERROR_STATUS.TICKET_NOT_VALIDATED || 500;
    throw err;
  }

  logger.info(`[PAYMENT SERVICE] Ticket ${numericId} validé avec succès`);

  // 🧹 Nettoyage du cache
  clearPaymentData(numericId);

  // 📢 Publication Kafka
  await publishKafkaEvent('ticket', {
    type: 'PaymentSucceeded',
    ticketId: numericId,
    amount,
    confirmedAt: new Date().toISOString(),
    mode
  });

  return { ticketId: numericId, amount, status: 'VALID' };
}

module.exports = { confirmPaymentService };
