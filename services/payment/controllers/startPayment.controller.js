const { startPaymentService } = require('../services/startPayment.service');
const { sendBusinessSuccess, sendBusinessError } = require('../utils/sendSuccess');

async function startPaymentController(req, res) {
  const { ticketId, amount } = req.body;
  try {
    const result = await startPaymentService(
      ticketId,
      amount,
      (process.env.USE_MOCK_PAYMENT || '').toLowerCase() === 'true'
    );
    return sendBusinessSuccess(res, 'START_PAYMENT', result);
  } catch (err) {
    return sendBusinessError(res, err.message || 'INTERNAL_SERVER_ERROR');
  }
}

module.exports = { startPaymentController };
