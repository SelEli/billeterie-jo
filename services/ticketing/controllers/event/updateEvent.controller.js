// controllers/event/updateEvent.controller.js
const { updateEventSchema } = require('../../validators/event.validator');
const eventUpdateService = require('../../services/event/eventUpdate.service');
const logger = require('../../utils/logger');

module.exports = async (req, res) => {
  try {
    if (req.user.role !== 'ADMIN') {
      return res.status(403).json({ status: 'error', meta: { message: 'Forbidden' } });
    }

    const parsed = updateEventSchema.parse(req.body);
    await eventUpdateService(req.params.id, parsed);

    res.json({
      status: 'success',
      data: { updated: true },
      meta: { message: 'Event updated successfully' }
    });
  } catch (err) {
    logger.error(err);
    res.status(400).json({ status: 'error', meta: { message: err.message } });
  }
};
