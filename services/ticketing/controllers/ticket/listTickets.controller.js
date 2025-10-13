// controllers/ticket/listTickets.controller.js
const monitor = require('../../monitor/monitor');
const { listTicketsService } = require('../../services/ticket');

// Import centralisé depuis utils/index.js
const {
  logger,
  sendBusinessError,
  sendBusinessSuccess,
  ERROR_STATUS,
} = require('../../utils');


async function listTicketsController(req, res) {
  logger.info('[CTRL][LIST] Entrée', { query: req.query });

  const timer = monitor.timer('ticket_list').start();
  try {
    if (req.query?.limit && isNaN(Number(req.query.limit))) {
      timer.stop();
      return sendBusinessError(res, 'INVALID_QUERY_LIMIT', 400);
    }
    if (req.query?.page && isNaN(Number(req.query.page))) {
      timer.stop();
      return sendBusinessError(res, 'INVALID_QUERY_PAGE', 400);
    }

    const result = await listTicketsService(req.query);
    timer.stop();

    if (result?.error) {
      const code = result.error in ERROR_STATUS ? result.error : 'BAD_REQUEST';
      return sendBusinessError(res, code, 400);
    }

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
    logger.error('[CTRL][LIST] Erreur listing tickets', { error: error.message });
    const code = error.message && error.message in ERROR_STATUS ? error.message : 'INTERNAL_SERVER_ERROR';
    return sendBusinessError(res, code, 500);
  }
}

module.exports = { listTicketsController };
