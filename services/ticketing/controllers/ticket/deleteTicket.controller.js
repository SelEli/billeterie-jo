// controllers/tickets/deleteTicket.controller.js

const logger  = require('../../utils/logger');
const monitor = require('../../monitor/monitor');
const { deleteTicketService } = require('../../services/ticket/deleteTicket.service');

async function deleteTicketController(req, res, next) {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id <= 0) {
    return res.status(400).json({
      status: 'error',
      data:   null,
      errors: ['Invalid ticket ID'],
      meta:   { message: 'Invalid request' }
    });
  }

  const timer = monitor.timer('ticket_delete').start();
  try {
    const deleted = await deleteTicketService(id);
    timer.stop();

    // Si ton service retourne null pour un ID inexistant
    if (!deleted) {
      logger.warn('Ticket not found for deletion');
      return res.status(404).json({
        status: 'error',
        data:   null,
        errors: ['Ticket not found'],
        meta:   { message: 'No ticket with this ID to delete' }
      });
    }

    logger.info('Ticket deleted successfully');
    return res.status(204).end();
  } catch (error) {
    timer.stop();

    // Prisma renvoie une erreur P2025 quand l'enregistrement n'existe pas
    if (error.code === 'P2025' || error.message.toLowerCase().includes('not found')) {
      logger.warn('Ticket not found for deletion', error);
      return res.status(404).json({
        status: 'error',
        data:   null,
        errors: ['Ticket not found'],
        meta:   { message: 'No ticket with this ID to delete' }
      });
    }

    logger.error('Error deleting ticket', error);
    return res.status(500).json({
      status: 'error',
      data:   null,
      errors: [error.message],
      meta:   { message: 'Failed to delete ticket' }
    });
  }
}

module.exports = { deleteTicketController };
