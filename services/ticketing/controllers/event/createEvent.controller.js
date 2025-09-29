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

    // Validation stricte
    const parsed = createEventSchema.parse(req.body);

    // ⚠️ On retire l'id si présent pour éviter les collisions Prisma
    const { id, ...safePayload } = parsed;

    logger.info(`[EVENT CONTROLLER] Creating event by user ${req.user.userId}`);

    const event = await createEventService(safePayload);

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

    return res.status(err.statusCode || 500).json({
      status: 'error',
      data: null,
      errors: [err.message || 'Internal server error'],
      meta: {}
    });
  }
}

module.exports = { createEventController };
