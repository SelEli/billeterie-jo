const logger = require('../../../utils/logger');
const monitor = require('../../../monitor/monitor');
const { deleteTicket } = require('../../../services/ticket/deleteTicket.service');
const { emitTicketCreated, emitTicketUpdated } = require('../../../kafka/ticket.kafka');

async function deleteTicketController(req, res) {
  try {
    const id = Number(req.params.id);
    await monitor.timer('ticket.delete', () => deleteTicket(id));
    logger.info(`Ticket deleted [id=${id}]`);
    await emitTicketUpdated({ id, status: 'CANCELLED' });
    res.status(204).end();
  } catch (err) {
    logger.error(`deleteTicket error: ${err.message}`);
    res.status(400).json({ message: err.message });
  }
}

module.exports = { deleteTicketController };
