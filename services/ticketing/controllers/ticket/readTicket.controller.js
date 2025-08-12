const logger  = require('../../utils/logger');
const monitor = require('../../monitor/monitor');
const { readTicketService } = require('../../services/ticket/readTicket.service');

async function readTicketController(req, res, next) {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id <= 0) {
    return res.status(400).json({
      status: 'error',
      data:   null,
      errors: ['Invalid ticket ID'],
      meta:   { message: 'Invalid request' }
    });
  }

  const timer = monitor.timer('ticket_read').start();
  try {
    const ticket = await readTicketService(id);
    if (!ticket) {
      timer.stop();
      logger.warn('Ticket not found');
      return res.status(404).json({
        status: 'error',
        data:   null,
        errors: ['Ticket not found'],
        meta:   { message: 'No ticket with this ID' }
      });
    }

    timer.stop();
    logger.info('Ticket read successfully');
    return res.status(200).json({
      status: 'success',
      data:   ticket,
      errors: [],
      meta:   { message: 'Ticket retrieved successfully' }
    });
  } catch (error) {
    timer.stop();
    logger.error('Error reading ticket', error);
    return res.status(500).json({
      status: 'error',
      data:   null,
      errors: [error.message],
      meta:   { message: 'Failed to read ticket' }
    });
  }
}

module.exports = { readTicketController };
