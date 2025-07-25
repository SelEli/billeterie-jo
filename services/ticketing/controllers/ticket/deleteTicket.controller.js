const logger = require('../../utils/logger');
const monitor = require('../../monitor/monitor');
const { readTicket } = require('../../services/ticket/readTicket.service');
const { deleteTicket } = require('../../services/ticket/deleteTicket.service');
const { emitTicketUpdated, emitTicketDeleted } = require('../../kafka/ticket.kafka');

async function deleteTicketController(req, res, next) {
  try {
    const id = Number(req.params.id);

    const ticket = await readTicket(id);
    if (!ticket) {
      return res.status(404).json({ message: 'Ticket not found.' });
    }

    await monitor.timer('ticket.delete', () => deleteTicket(id));
    logger.info(`Ticket deleted [id=${id}]`);

    const cancelledTicket = { ...ticket, status: 'CANCELLED' };
    await emitTicketUpdated(cancelledTicket);
    await emitTicketDeleted(id);

    res.status(204).end();
  } catch (err) {
    logger.error(`deleteTicket error: ${err.message}`);
    next(err);
  }
}

module.exports = { deleteTicketController };
