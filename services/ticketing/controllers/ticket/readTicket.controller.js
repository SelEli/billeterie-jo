const logger  = require('../../utils/logger');
const monitor = require('../../monitor/monitor');
const { readTicketService } = require('../../services/ticket/readTicket.service');
const { sendBusinessError } = require('../../utils/sendError');
const { sendBusinessSuccess } = require('../../utils/sendSuccess');
const { ERROR_STATUS } = require('../../utils/httpErrorMap');

async function readTicketController(req, res) {
  const { id } = req.params;
  const numId = Number(id);
  logger.info('[CTRL][READ] Entrée', { id, query: req.query });

  if (!id || isNaN(numId) || numId <= 0) {
    logger.warn('[CTRL][READ] INVALID_TICKET_ID', { id });
    return sendBusinessError(res, 'INVALID_TICKET_ID', 400);
  }

  const timer = monitor.timer('ticket_read').start();
  try {
    const includeSecret = req.query.includeSecret === 'true';
    const ticket = await readTicketService(numId, req.headers.authorization, { includeSecret });

    timer.stop();

    if (!ticket) {
      logger.warn('[CTRL][READ] TICKET_NOT_FOUND', { id: numId });
      return sendBusinessError(res, 'TICKET_NOT_FOUND', 404);
    }

    return sendBusinessSuccess(res, 'READ_ONE', ticket, { message: 'Ticket retrieved successfully' }, 200);

  } catch (error) {
    timer.stop();
    logger.error('[CTRL][READ] Erreur lecture ticket', { error: error.message });
    const code = error.message && error.message in ERROR_STATUS ? error.message : 'INTERNAL_SERVER_ERROR';
    return sendBusinessError(res, code, 500);
  }
}

module.exports = { readTicketController };
