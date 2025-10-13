// controllers/ticket/deleteTicket.controller.js
const monitor = require('../../monitor/monitor');
const { deleteTicketService } = require('../../services/ticket');

// Import centralisé depuis utils/index.js
const {
  logger,
  sendBusinessError,
  sendBusinessSuccess,
  ERROR_STATUS,
} = require('../../utils');


async function deleteTicketController(req, res) {
  logger.info('[CTRL][DELETE] Entrée', { user: req.user, params: req.params });

  if (!req.user || !['ADMIN', 'AGENT'].includes(req.user.role)) {
    logger.warn('[CTRL][DELETE] FORBIDDEN', { user: req.user });
    return sendBusinessError(res, 'FORBIDDEN', 403);
  }

  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id <= 0) {
    logger.warn('[CTRL][DELETE] INVALID_TICKET_ID', { id });
    return sendBusinessError(res, 'INVALID_TICKET_ID', 400);
  }

  const timer = monitor.timer('ticket_delete').start();
  try {
    const deleted = await deleteTicketService(id);
    timer.stop();

    if (!deleted) {
      logger.warn('[CTRL][DELETE] TICKET_NOT_FOUND', { id });
      return sendBusinessError(res, 'TICKET_NOT_FOUND', 404);
    }

    logger.info('[CTRL][DELETE] Ticket supprimé', { id });
    return sendBusinessSuccess(res, 'DELETE_TICKET', null, { message: 'Ticket deleted successfully' }, 200);

  } catch (error) {
    timer.stop();
    logger.error('[CTRL][DELETE] Erreur suppression ticket', { error: error.message });
    const code = error.message && error.message in ERROR_STATUS ? error.message : 'INTERNAL_SERVER_ERROR';
    return sendBusinessError(res, code, 500);
  }
}

module.exports = { deleteTicketController };
