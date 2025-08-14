const { readEventService } = require('../../services/event/readEvent.service');
const logger = require('../../utils/logger');

module.exports = async (req, res) => {
  try {
    logger.debug(`[EVENT CONTROLLER] Reading event ${req.params.id}`);
    const event = await readEventService(req.params.id);

    if (!event) {
      return res.status(404).json({ status: 'error', meta: { message: 'Event not found' } });
    }

    logger.info(`[EVENT CONTROLLER] Event read: ${event.id}`);
    res.json({ status: 'success', data: event });
  } catch (err) {
    logger.error(`[EVENT CONTROLLER] Read failed for ${req.params.id}: ${err.message}`);
    res.status(400).json({ status: 'error', meta: { message: err.message } });
  }
};
