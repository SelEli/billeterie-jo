const { listEventsService } = require('../../services/event/listEvents.service');
const logger = require('../../utils/logger');

async function listEventsController(req, res) {
  try {
    const { dateFrom, dateTo, location } = req.query || {};
    const where = {};

    if (dateFrom) {
      const from = new Date(dateFrom);
      if (isNaN(from)) {
        return res.status(400).json({
          status: 'error',
          data: null,
          errors: ['Invalid dateFrom'],
          meta: {}
        });
      }
      where.date = { ...(where.date || {}), gte: from };
    }

    if (dateTo) {
      const to = new Date(dateTo);
      if (isNaN(to)) {
        return res.status(400).json({
          status: 'error',
          data: null,
          errors: ['Invalid dateTo'],
          meta: {}
        });
      }
      where.date = { ...(where.date || {}), lte: to };
    }

    if (location && location.trim()) {
      where.location = { contains: location.trim(), mode: 'insensitive' };
    }

    const events = await listEventsService(where);

    return res.status(200).json({
      status: 'success',
      data: events,
      errors: [],
      meta: { count: events.length }
    });
  } catch (err) {
    logger.error(`[EVENT CONTROLLER] List failed: ${err.message}`);
    return res.status(500).json({
      status: 'error',
      data: null,
      errors: [err.message],
      meta: {}
    });
  }
}

module.exports = { listEventsController };
