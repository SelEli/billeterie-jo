const logger  = require('../../utils/logger');
const monitor = require('../../monitor/monitor');
const { readTicketService } = require('../../services/ticket/readTicket.service');
const { sendBusinessError } = require('../../utils/sendError');
const { sendBusinessSuccess } = require('../../utils/sendSuccess');
const { ERROR_STATUS } = require('../../utils/httpErrorMap');

/**
 * Contrôleur unique : expose ou non secretKey selon query param
 * - Front : /ticket/:id
 * - Interne (Verification Service) : /ticket/:id?includeSecret=true
 */
async function readTicketController(req, res) {
  const { id } = req.params;
  const numId = Number(id);

  if (!id || isNaN(numId) || numId <= 0) {
    return sendBusinessError(res, 'INVALID_TICKET_ID');
  }

  const timer = monitor.timer('ticket_read').start();
  try {
    const includeSecret = req.query.includeSecret === 'true'; // 🔹 flag dans la query
    const ticket = await readTicketService(numId, req.headers.authorization, { includeSecret });

    timer.stop();

    if (!ticket) {
      return sendBusinessError(res, 'TICKET_NOT_FOUND');
    }

    return sendBusinessSuccess(res, 'READ_ONE', ticket);
  } catch (error) {
    timer.stop();
    logger.error(`[TICKET CONTROLLER] Error reading ticket ${numId}: ${error.message}`);
    const code = error.message && error.message in ERROR_STATUS
      ? error.message
      : 'INTERNAL_SERVER_ERROR';
    return sendBusinessError(res, code);
  }
}

module.exports = { readTicketController };
