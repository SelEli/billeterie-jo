const logger  = require('../../utils/logger');
const monitor = require('../../monitor/monitor');
const { updateTicketService } = require('../../services/ticket/updateTicket.service');

async function updateTicketController(req, res, next) {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id <= 0) {
    return res.status(400).json({
      status: 'error',
      data:   null,
      errors: ['Invalid ticket ID'],
      meta:   { message: 'Invalid request' }
    });
  }

  const timer = monitor.timer('ticket_update').start();
  try {
    const updates = { ...req.body };
    const ticket  = await updateTicketService(id, updates);

    if (!ticket) {
      timer.stop();
      logger.warn('Ticket not found for update');
      return res.status(404).json({
        status: 'error',
        data:   null,
        errors: ['Ticket not found'],
        meta:   { message: 'No ticket with this ID to update' }
      });
    }

    timer.stop();
    logger.info('Ticket updated successfully');
    return res.status(200).json({
      status: 'success',
      data:   ticket,
      errors: [],
      meta:   { message: 'Ticket updated successfully' }
    });
  } catch (error) {
    timer.stop();
    logger.error('Error updating ticket', error);
    return res.status(500).json({
      status: 'error',
      data:   null,
      errors: [error.message],
      meta:   { message: 'Failed to update ticket' }
    });
  }
}

module.exports = { updateTicketController };
