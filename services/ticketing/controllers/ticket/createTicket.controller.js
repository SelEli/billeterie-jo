const logger = require('../../utils/logger');
const monitor = require('../../monitor/monitor');
const { createTicket } = require('../../services/ticket/createTicket.service');
const { emitTicketCreated } = require('../../kafka/ticket.kafka');

async function createTicketController(req, res) {
  try {
    const data = req.validated;
    const { ticket, duration } = await monitor.timer('ticket.create', () => createTicket(data));
    logger.info(`Ticket created [id=${ticket.id}] in ${duration}ms`);
    await emitTicketCreated(ticket);
    res.status(201).json(ticket);
  } catch (err) {
    logger.error(`createTicket error: ${err.message}`);
    res.status(400).json({ message: err.message });
  }
}

module.exports = { createTicketController };
