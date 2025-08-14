const { createEventSchema } = require('../../schemas/event.schema');
const { createEventService } = require('../../services/event/createEvent.service');
const logger = require('../../utils/logger');

module.exports = async (req, res) => {
  try {
    if (!['ADMIN', 'AGENT'].includes(req.user.role)) {
      return res.status(403).json({ status: 'error', meta: { message: 'Forbidden' } });
    }

    const parsed = createEventSchema.parse(req.body);
    logger.info(`[EVENT CONTROLLER] Creating event by user ${req.user.id}`);
    const event = await createEventService(parsed);

    logger.info(`[EVENT CONTROLLER] Event created: ${event.id}`);
    res.status(201).json({
      status: 'success',
      data: { eventId: event.id },
      meta: { message: 'Event created successfully' }
    });
  } catch (err) {
    logger.error(`[EVENT CONTROLLER] Create failed: ${err.message}`);
    res.status(400).json({ status: 'error', meta: { message: err.message } });
  }
};
