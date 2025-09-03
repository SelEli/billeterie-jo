// controllers/verification/verifyTicket.controller.js
const { verifyTicketService } = require('../../services/verification/verifyTicket.service');
const { sendBusinessError } = require('../../utils/sendError');
const { sendBusinessSuccess } = require('../../utils/sendSuccess');

async function verifyTicketController(req, res) {
  // Réservé aux agents
  if (!req.user || !['AGENT', 'ADMIN'].includes(req.user.role)) {
    return sendBusinessError(res, 'FORBIDDEN');
  }

  const { signature } = req.body;
  try {
    const updated = await verifyTicketService({ signature });
    return sendBusinessSuccess(res, 'VERIFY_TICKET', updated, { message: 'Ticket verified successfully' });
  } catch (err) {
    return sendBusinessError(res, err.message || 'INTERNAL_SERVER_ERROR');
  }
}

module.exports = { verifyTicketController };
