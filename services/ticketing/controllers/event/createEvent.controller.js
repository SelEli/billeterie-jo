// controllers/event/createEvent.controller.js
const { createEventSchema } = require('../../validators/event.validator');
const eventCreationService = require('../../services/event/eventCreation.service');
const logger = require('../../utils/logger');

module.exports = async (req, res) => {
  try {
    if (!['ADMIN', 'AGENT'].includes(req.user.role)) {
      return res.status(403).json({ status: 'error', meta: { message: 'Forbidden' } });
    }

    const parsed = createEventSchema.parse(req.body);
    const event = await eventCreationService(parsed);

    res.status(201).json({
      status: 'success',
      data: { eventId: event.id },
      meta: { message: 'Event created successfully' }
    });
  } catch (err) {
    logger.error(err);
    res.status(400).json({ status: 'error', meta: { message: err.message } });
  }
};
