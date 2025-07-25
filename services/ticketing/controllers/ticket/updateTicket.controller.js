const monitor = require('../../monitor/monitor');
const logger = require('../../utils/logger');
const { updateTicket } = require('../../services/ticket/updateTicket.service');
const { emitTicketUpdated } = require('../../kafka/ticket.kafka');

async function updateTicketController(req, res, next) {
  try {
    const ticketId = Number(req.params.id);
    const data = req.body;

    // monitor.timer retourne { result, duration }
    const { result, duration } = await monitor.timer('ticket.update', () => updateTicket(ticketId, data));
    const { ticket } = result;

    if (!ticket) {
      return res.status(404).json({ message: 'Ticket not found.' });
    }

    logger.info(`Ticket updated [id=${ticket.id}] in ${duration}ms`);
    await emitTicketUpdated(ticket);

    res.status(200).json(ticket);
  } catch (err) {
    logger.error(`updateTicket error: ${err.message}`);
    next(err);
  }
}

module.exports = { updateTicketController };
