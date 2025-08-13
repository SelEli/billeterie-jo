// controllers/event/listEvents.controller.js
const { eventQueryService } = require('../../services/event/eventQuery.service');
const logger = require('../../utils/logger');

module.exports = async (req, res) => {
  try {
    const { dateFrom, dateTo, location } = req.query;
    const where = {};

    // Exclu par défaut dans le service: deletedAt = null
    if (dateFrom || dateTo) {
      where.date = {};
      if (dateFrom) where.date.gte = new Date(dateFrom);
      if (dateTo) where.date.lte = new Date(dateTo);
    }
    if (location) {
      where.location = { contains: location, mode: 'insensitive' };
    }

    const events = await eventQueryService(where);
    logger.info(`Events listed: ${events.length}`);
    res.json({ status: 'success', data: events });
  } catch (err) {
    logger.error(err);
    res.status(400).json({ status: 'error', meta: { message: err.message } });
  }
};
