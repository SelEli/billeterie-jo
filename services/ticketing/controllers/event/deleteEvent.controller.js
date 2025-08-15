const { deleteEventService } = require('../../services/event/deleteEvent.service');
const logger = require('../../utils/logger');

async function deleteEventController(req, res) {
  try {
    if (!req.user || req.user.role !== 'ADMIN') {
      return res.status(403).json({
        status: 'error',
        data: null,
        errors: ['Forbidden'],
        meta: {}
      });
    }

    const id = parseInt(req.params.id, 10);
    if (isNaN(id) || id <= 0) {
      return res.status(400).json({
        status: 'error',
        data: null,
        errors: ['Invalid event ID'],
        meta: {}
      });
    }

    const deleted = await deleteEventService(id);

    if (!deleted) {
      logger.info(`[EVENT CONTROLLER] Event not found: ${id}`);
      return res.status(404).json({
        status: 'error',
        data: null,
        errors: [],
        meta: { message: 'Event not found' }
      });
    }

    return res.status(204).send();
  } catch (err) {
    logger.error(`[EVENT CONTROLLER] Delete failed: ${err.message}`);

    if (err.statusCode === 404 || err.message === 'Event not found') {
      return res.status(404).json({
        status: 'error',
        data: null,
        errors: [],
        meta: { message: err.message }
      });
    }

    return res.status(err.statusCode || 500).json({
      status: 'error',
      data: null,
      errors: [err.message],
      meta: {}
    });
  }
}

module.exports = { deleteEventController };
