const logger = require('../../../utils/logger');
const monitor = require('../../../monitor/monitor');
const { updateTicket } = require('../../../services/ticket/updateTicket.service');
const { emitTicketCreated, emitTicketUpdated } = require('../../../kafka/ticket.kafka');

async function updateTicketController(req, res) {
  try {
    const data = { ...req.validated, id: Number(req.params.id) };
    const { ticket, duration } = await monitor.timer('ticket.update', () => updateTicket(data));
    logger.info(`Ticket updated [id=${ticket.id}] in ${duration}ms`);
    await emitTicketUpdated(ticket);
    res.status(200).json(ticket);
  } catch (err) {
    logger.error(`updateTicket error: ${err.message}`);
    res.status(400).json({ message: err.message });
  }
}

module.exports = { updateTicketController };
