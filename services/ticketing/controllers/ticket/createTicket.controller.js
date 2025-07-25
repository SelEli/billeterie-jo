const logger = require('../../utils/logger');
const monitor = require('../../monitor/monitor');
const { createTicket } = require('../../services/ticket/createTicket.service');
const { emitTicketCreated } = require('../../kafka/ticket.kafka');

async function createTicketController(req, res, next) {
  try {
    const data = req.validated;
    const { result: ticket, duration } = await monitor.timer('ticket.create', () => createTicket(data));
    
    logger.info(`Ticket created [id=${ticket.id}] in ${duration}ms`);
    await emitTicketCreated(ticket);
    
    res.status(201).json(ticket);
  } catch (err) {
    logger.error(`createTicket error: ${err.message}`);
    next(err);
  }
}

module.exports = { createTicketController };
