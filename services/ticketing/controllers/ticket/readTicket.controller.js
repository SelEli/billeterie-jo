const logger = require('../../utils/logger');
const monitor = require('../../monitor/monitor');
const { readTicket } = require('../../services/ticket/readTicket.service');

async function readTicketController(req, res, next) {
  try {
    const id = Number(req.params.id);
    const { result: ticket, duration } = await monitor.timer('ticket.read', () => readTicket(id));
    
    logger.info(`Ticket read [id=${id}] in ${duration}ms`);
    if (!ticket) return res.status(404).json({ message: 'Ticket not found.' });

    res.status(200).json(ticket);
  } catch (err) {
    logger.error(`readTicket error: ${err.message}`);
    next(err);
  }
}

module.exports = { readTicketController };
