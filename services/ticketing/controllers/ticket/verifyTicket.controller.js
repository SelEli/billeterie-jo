const { verifyTicketService } = require('../../services/ticket/verifyTicket.service');
const { sendBusinessError } = require('../../utils/sendError');
const { sendBusinessSuccess } = require('../../utils/sendSuccess');

async function verifyTicketController(req, res) {
  console.log('>>> [VERIFY CTRL] Incoming request:', {
    method: req.method,
    url: req.originalUrl,
    headers: req.headers,
    body: req.body,
    query: req.query
  });

  try {
    const { ticketId } = req.body;
    const ticketIdNum = Number(ticketId);

    if (!ticketId || isNaN(ticketIdNum)) {
      console.log('>>> [VERIFY CTRL] ticketId invalide:', ticketId);
      return sendBusinessError(res, 'INVALID_TICKET_ID');
    }

    console.log('>>> [VERIFY CTRL] Mise à jour ticket en USED pour id:', ticketIdNum);

    const result = await verifyTicketService({ ticketId: ticketIdNum });

    if (result.status === 'error') {
      console.log('>>> [VERIFY CTRL] Erreur service:', result.errors);
      return sendBusinessError(res, result.errors?.[0] || 'VERIFY_FAILED');
    }

    console.log('>>> [VERIFY CTRL] Succès service:', result.data);
    return sendBusinessSuccess(res, 'VERIFY_TICKET_SUCCESS', result.data);
  } catch (err) {
    console.log('>>> [VERIFY CTRL] Exception:', err);
    return sendBusinessError(res, 'INTERNAL_SERVER_ERROR');
  }
}

module.exports = { verifyTicketController };
