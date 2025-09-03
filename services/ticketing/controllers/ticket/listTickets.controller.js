// controllers/ticket/listTickets.controller.js
const logger  = require('../../utils/logger');
const monitor = require('../../monitor/monitor');
const { listTicketsService } = require('../../services/ticket/listTickets.service');
const { sendBusinessError } = require('../../utils/sendError');
const { sendBusinessSuccess } = require('../../utils/sendSuccess');

async function listTicketsController(req, res) {
  const timer = monitor.timer('ticket_list').start();
  try {
    logger.debug('[TICKET CONTROLLER] Listing tickets', { filters: req.query });

    // Validation simple de limit/page si non filtré par Zod
    if (req.query?.limit && isNaN(Number(req.query.limit))) {
      timer.stop();
      return sendBusinessError(res, 'INVALID_QUERY_LIMIT', 400);
    }
    if (req.query?.page && isNaN(Number(req.query.page))) {
      timer.stop();
      return sendBusinessError(res, 'INVALID_QUERY_PAGE', 400);
    }

    // Appel du service avec les filtres et pagination
    const result = await listTicketsService(req.query);
    timer.stop();

    // Gestion des erreurs métier
    if (result?.error) {
      const statusMap = {
        INVALID_USER_ID: 400,
        INVALID_STATUS: 400
      };
      return sendBusinessError(res, result.error, statusMap[result.error] || 400);
    }

    // On retire les champs sensibles (secretKey) avant envoi
    const safeTickets = result.tickets.map(({ secretKey, ...rest }) => rest);

    return sendBusinessSuccess(
      res,
      'READ_LIST',
      safeTickets,
      {
        message: 'Tickets retrieved successfully',
        pagination: result.pagination
      },
      200
    );
  } catch (error) {
    timer.stop();
    logger.error('[TICKET CONTROLLER] Error listing tickets', error);
    return sendBusinessError(res, 'INTERNAL_SERVER_ERROR', 500);
  }
}

module.exports = { listTicketsController };
