const { verifyTicketService } = require('../../services/ticket/verifyTicket.service');
const { sendBusinessError } = require('../../utils/sendError');
const { sendBusinessSuccess } = require('../../utils/sendSuccess');

async function verifyTicketController(req, res) {
  console.log('>>> [VERIFY CTRL] Incoming request:', {
    method: req.method,
    url: req.originalUrl,
    headers: req.headers,
    body: req.body,
    query: req.query,
    params: req.params,
    ip: req.ip
  });

  try {
    const { ticketId } = req.body;
    const ticketIdNum = Number(ticketId);

    console.log('>>> [VERIFY CTRL] ticketId brut:', ticketId, ' → converti en:', ticketIdNum);

    if (!ticketId || isNaN(ticketIdNum)) {
      console.log('>>> [VERIFY CTRL] ticketId invalide:', ticketId);
      return sendBusinessError(res, 'INVALID_TICKET_ID');
    }

    console.log('>>> [VERIFY CTRL] Appel service pour mise à jour en USED du ticket:', ticketIdNum);

    const result = await verifyTicketService({ ticketId: ticketIdNum });

    console.log('>>> [VERIFY CTRL] Résultat brut du service:', result);

    if (result.status === 'error') {
      console.log('>>> [VERIFY CTRL] Erreur service détectée:', result.errors);
      return sendBusinessError(res, result.errors?.[0] || 'VERIFY_FAILED');
    }

    console.log('>>> [VERIFY CTRL] Succès service, data renvoyée:', result.data);
    return sendBusinessSuccess(res, 'VERIFY_TICKET_SUCCESS', result.data);
  } catch (err) {
    console.log('>>> [VERIFY CTRL] Exception attrapée:', {
      message: err.message,
      stack: err.stack
    });
    return sendBusinessError(res, 'INTERNAL_SERVER_ERROR');
  }
}

module.exports = { verifyTicketController };
