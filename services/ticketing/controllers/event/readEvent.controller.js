const { readEventService } = require('../../services/event/readEvent.service');
const logger = require('../../utils/logger');

async function readEventController(req, res) {
  const { id } = req.params;

  try {
    const numId = Number(id);
    if (!id || isNaN(numId) || numId <= 0) {
      logger.warn(`[EVENT CONTROLLER] Invalid event ID param: "${id}"`);
      return res.status(400).json({
        status: 'error',
        data: null,
        errors: ['Invalid event ID'],
        meta: {}
      });
    }

    logger.debug(`[EVENT CONTROLLER] Reading event ${numId}`);

    const event = await readEventService(numId);

    if (!event) {
      logger.info(`[EVENT CONTROLLER] Event not found: ${numId}`);
      return res.status(404).json({
        status: 'error',
        data: null,
        errors: [],
        meta: { message: 'Event not found' } // ✅ conforme au test GET inexistant
      });
    }

    logger.info(`[EVENT CONTROLLER] Event read: ${event.id}`);
    return res.status(200).json({
      status: 'success',
      data: event,
      errors: [],
      meta: {}
    });
  } catch (err) {
    logger.error(`[EVENT CONTROLLER] Read failed for ${id}: ${err.message}`);

    if (err.statusCode === 404 || err.message === 'Event not found') {
      return res.status(404).json({
        status: 'error',
        data: null,
        errors: [],
        meta: { message: 'Event not found' } // ✅ idem dans le catch
      });
    }

    return res.status(err.statusCode || 500).json({
      status: 'error',
      data: null,
      errors: [err.message || 'Internal server error'],
      meta: {}
    });
  }
}

module.exports = { readEventController };
