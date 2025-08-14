const { updateEventSchema } = require('../../schemas/event.schema');
const { updateEventService } = require('../../services/event/updateEvent.service');
const logger = require('../../utils/logger');

module.exports = async (req, res) => {
  try {
    if (req.user.role !== 'ADMIN') {
      return res.status(403).json({ status: 'error', meta: { message: 'Forbidden' } });
    }

    const parsed = updateEventSchema.parse(req.body);
    logger.info(`[EVENT CONTROLLER] Updating event ${req.params.id} by user ${req.user.id}`);
    await updateEventService(req.params.id, parsed);

    logger.info(`[EVENT CONTROLLER] Event updated: ${req.params.id}`);
    res.json({
      status: 'success',
      data: { updated: true },
      meta: { message: 'Event updated successfully' }
    });
  } catch (err) {
    logger.error(`[EVENT CONTROLLER] Update failed for ${req.params.id}: ${err.message}`);
    res.status(400).json({ status: 'error', meta: { message: err.message } });
  }
};
