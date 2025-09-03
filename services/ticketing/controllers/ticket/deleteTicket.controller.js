// controllers/ticket/deleteTicket.controller.js
const logger  = require('../../utils/logger');
const monitor = require('../../monitor/monitor');
const { deleteTicketService } = require('../../services/ticket/deleteTicket.service');
const { sendBusinessError } = require('../../utils/sendError');
const { sendBusinessSuccess } = require('../../utils/sendSuccess');

async function deleteTicketController(req, res) {
  // Vérification rôle : seuls ADMIN et AGENT peuvent supprimer
  if (!req.user || !['ADMIN', 'AGENT'].includes(req.user.role)) {
    return sendBusinessError(res, 'FORBIDDEN', 403);
  }

  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id <= 0) {
    return sendBusinessError(res, 'INVALID_TICKET_ID', 400);
  }

  const timer = monitor.timer('ticket_delete').start();
  try {
    const deleted = await deleteTicketService(id);
    timer.stop();

    if (!deleted) {
      return sendBusinessError(res, 'TICKET_NOT_FOUND', 404);
    }

    logger.info(`[TICKET CONTROLLER] Ticket ${id} deleted successfully`);
    return sendBusinessSuccess(res, 'DELETE_TICKET', null, { message: 'Ticket deleted successfully' }, 204);
  } catch (error) {
    timer.stop();
    logger.error(`[TICKET CONTROLLER] Error deleting ticket ${id}: ${error.message}`);
    return sendBusinessError(res, 'INTERNAL_SERVER_ERROR', 500);
  }
}

module.exports = { deleteTicketController };
