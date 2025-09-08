const axios = require('axios');
const jwt = require('jsonwebtoken');
const { publishKafkaEvent } = require('../utils/kafkaClient');
const logger = require('../utils/logger');
const { ERROR_STATUS } = require('../utils/httpErrorMap');

async function confirmPaymentService(ticketId, amount, isMock = false) {
  const numericId = Number(ticketId);
  if (!numericId) {
    const err = new Error('INVALID_TICKET_ID');
    err.statusCode = ERROR_STATUS.INVALID_TICKET_ID;
    throw err;
  }

  logger.info(`[PAYMENT SERVICE] Confirmation paiement pour ticket ${numericId} (mock=${isMock})`);

  const token = jwt.sign(
    {
      userId: Number(process.env.PAYMENT_SERVICE_USER_ID),
      role: 'AGENT'
    },
    process.env.JWT_SECRET,
    { expiresIn: '5m' }
  );

  const resp = await axios.post(
    `${process.env.TICKET_API_URL}/ticket/validate`,
    { ticketId: numericId },
    { headers: { Authorization: `Bearer ${token}` } }
  );

  await publishKafkaEvent('ticketing', {
    type: 'PaymentConfirmed',
    ticketId: numericId,
    amount: amount || null,
    confirmedAt: new Date().toISOString(),
    mode: isMock ? 'mock' : 'live'
  });

  return resp.data;
}

module.exports = { confirmPaymentService };
