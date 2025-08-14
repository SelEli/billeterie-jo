const { listEventsService } = require('../../services/event/listEvents.service');
const logger = require('../../utils/logger');

module.exports = async (req, res) => {
  try {
    const { dateFrom, dateTo, location } = req.query;
    const where = {};

    if (dateFrom || dateTo) {
      where.date = {};
      if (dateFrom) where.date.gte = new Date(dateFrom);
      if (dateTo) where.date.lte = new Date(dateTo);
    }
    if (location) {
      where.location = { contains: location, mode: 'insensitive' };
    }

    logger.debug(`[EVENT CONTROLLER] Listing events with filter: ${JSON.stringify(where)}`);
    const events = await listEventsService(where);

    logger.info(`[EVENT CONTROLLER] Events listed: ${events.length}`);
    res.json({ status: 'success', data: events });
  } catch (err) {
    logger.error(`[EVENT CONTROLLER] List failed: ${err.message}`);
    res.status(400).json({ status: 'error', meta: { message: err.message } });
  }
};
