// controllers/ticket/readTicket.controller.js
const logger  = require('../../utils/logger');
const monitor = require('../../monitor/monitor');
const { readTicketService } = require('../../services/ticket/readTicket.service');
const { sendBusinessError } = require('../../utils/sendError');
const { sendBusinessSuccess } = require('../../utils/sendSuccess');

async function readTicketController(req, res) {
  const { id } = req.params;
  const numId = Number(id);

  if (!id || isNaN(numId) || numId <= 0) {
    return sendBusinessError(res, 'INVALID_TICKET_ID');
  }

  const timer = monitor.timer('ticket_read').start();
  try {
    const ticket = await readTicketService(numId, req.headers.authorization);
    timer.stop();

    if (!ticket) {
      return sendBusinessError(res, 'TICKET_NOT_FOUND');
    }

    return sendBusinessSuccess(res, 'READ_ONE', ticket);
  } catch (error) {
    timer.stop();
    logger.error(`[TICKET CONTROLLER] Error reading ticket ${numId}: ${error.message}`);
    return sendBusinessError(res, 'INTERNAL_SERVER_ERROR');
  }
}

module.exports = { readTicketController };
