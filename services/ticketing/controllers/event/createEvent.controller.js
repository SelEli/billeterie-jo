const { createEventSchema } = require('../../validators/event.validator');
const { createEventService } = require('../../services/event/createEvent.service');
const logger = require('../../utils/logger');

async function createEventController(req, res) {
  try {
    if (!req.user || !['ADMIN', 'AGENT'].includes(req.user.role)) {
      return res.status(403).json({
        status: 'error',
        data: null,
        errors: ['Forbidden'],
        meta: {}
      });
    }

    const parsed = createEventSchema.parse(req.body);

    logger.info(`[EVENT CONTROLLER] Creating event by user ${req.user.userId}`);

    const event = await createEventService(parsed);

    return res.status(201).json({
      status: 'success',
      data: { eventId: event.id },
      errors: [],
      meta: { message: 'Event created successfully' }
    });
  } catch (err) {
    logger.error(`[EVENT CONTROLLER] Create failed: ${err.message}`);

    if (err?.name === 'ZodError') {
      return res.status(400).json({
        status: 'error',
        data: null,
        errors: err.issues?.map(i => i.message) ?? [err.message],
        meta: {}
      });
    }

    // Si ce n’est pas une erreur serveur explicite, on considère que c’est une requête invalide
    const statusCode = err.statusCode && err.statusCode >= 400
      ? err.statusCode
      : 400;

    return res.status(statusCode).json({
      status: 'error',
      data: null,
      errors: [err.message || 'Bad request'],
      meta: {}
    });
  }
}

module.exports = { createEventController };
