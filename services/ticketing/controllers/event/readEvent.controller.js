// controllers/event/readEvent.controller.js
const { eventReadService } = require('../../services/event/eventQuery.service');
const logger = require('../../utils/logger');

module.exports = async (req, res) => {
  try {
    const event = await eventReadService(req.params.id);
    if (!event) {
      return res.status(404).json({ status: 'error', meta: { message: 'Event not found' } });
    }
    logger.info(`Event read: ${event.id}`);
    res.json({ status: 'success', data: event });
  } catch (err) {
    logger.error(err);
    res.status(400).json({ status: 'error', meta: { message: err.message } });
  }
};
