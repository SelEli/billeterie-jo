const { confirmPaymentService } = require('../services/confirmPayment.service');
const { sendBusinessSuccess, sendBusinessError } = require('../utils/sendSuccess');

async function confirmPaymentController(req, res) {
  const { ticketId, amount } = req.body;
  try {
    const result = await confirmPaymentService(
      ticketId,
      amount,
      (process.env.USE_MOCK_PAYMENT || '').toLowerCase() === 'true'
    );
    return sendBusinessSuccess(res, 'CONFIRM_PAYMENT', result);
  } catch (err) {
    return sendBusinessError(res, err.message || 'INTERNAL_SERVER_ERROR');
  }
}

module.exports = { confirmPaymentController };
