const logger  = require('../../utils/logger');
const monitor = require('../../monitor/monitor');
const { readTicketService } = require('../../services/ticket/readTicket.service');

async function readTicketController(req, res) {
  const { id } = req.params;
  const numId = Number(id);

  // 🔹 Vérif paramètre ID
  if (!id || isNaN(numId) || numId <= 0) {
    logger.warn(`[TICKET CONTROLLER] Invalid ticket ID param: "${id}"`);
    return res.status(400).json({
      status: 'error',
      data: null,
      errors: ['Invalid ticket ID'],
      meta: {}
    });
  }

  const timer = monitor.timer('ticket_read').start();
  try {
    logger.debug(`[TICKET CONTROLLER] Reading ticket ${numId}`);
    const ticket = await readTicketService(numId);

    if (!ticket) {
      timer.stop();
      logger.info(`[TICKET CONTROLLER] Ticket not found: ${numId}`);
      return res.status(404).json({
        status: 'error',
        data: null,
        errors: ['Ticket not found'],
        meta: {}
      });
    }

    timer.stop();
    logger.info(`[TICKET CONTROLLER] Ticket read successfully: ${ticket.id}`);
    return res.status(200).json({
      status: 'success',
      data: ticket,
      errors: [],
      meta: {}
    });

  } catch (error) {
    timer.stop();
    logger.error(`[TICKET CONTROLLER] Error reading ticket ${numId}: ${error.message}`);
    return res.status(500).json({
      status: 'error',
      data: null,
      errors: [error.message || 'Internal server error'],
      meta: {}
    });
  }
}

module.exports = { readTicketController };
