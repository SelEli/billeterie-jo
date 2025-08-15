const { updateEventSchema } = require('../../validators/event.validator');
const { updateEventService } = require('../../services/event/updateEvent.service');
const logger = require('../../utils/logger');

async function updateEventController(req, res) {
  try {
    if (!req.user || req.user.role !== 'ADMIN') {
      return res.status(403).json({
        status: 'error',
        errors: ['Forbidden'],
        data: null,
        meta: {}
      });
    }

    const parsed = updateEventSchema.parse(req.body);
    const id = Number(req.params.id);

    if (isNaN(id) || id <= 0) {
      return res.status(400).json({
        status: 'error',
        errors: ['Invalid event ID'],
        data: null,
        meta: {}
      });
    }

    logger.info(`[EVENT CONTROLLER] Updating event ${id} by user ${req.user.id}`);

    const updatedEvent = await updateEventService(id, parsed);

    if (!updatedEvent) {
      logger.info(`[EVENT CONTROLLER] Event not found: ${id}`);
      return res.status(404).json({
        status: 'error',
        errors: [],
        data: null,
        meta: { message: 'Event not found' }
      });
    }

    logger.info(`[EVENT CONTROLLER] Event updated: ${id}`);
    return res.status(200).json({
      status: 'success',
      data: updatedEvent,
      errors: [],
      meta: { message: 'Event updated successfully' }
    });
  } catch (err) {
    logger.error(`[EVENT CONTROLLER] Update failed for ${req.params.id}: ${err.message}`);

    if (err?.name === 'ZodError') {
      return res.status(400).json({
        status: 'error',
        errors: err.issues?.map(i => i.message) ?? [err.message],
        data: null,
        meta: {}
      });
    }

    if (err.statusCode === 404) {
      return res.status(404).json({
        status: 'error',
        errors: [],
        data: null,
        meta: { message: err.message }
      });
    }

    return res.status(err.statusCode || 500).json({
      status: 'error',
      errors: [err.message],
      data: null,
      meta: {}
    });
  }
}

module.exports = { updateEventController };
