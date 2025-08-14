const { deleteEventService } = require('../../services/event/deleteEvent.service');
const logger = require('../../utils/logger');

module.exports = async (req, res) => {
  try {
    if (req.user.role !== 'ADMIN') {
      return res.status(403).json({ status: 'error', meta: { message: 'Forbidden' } });
    }

    logger.info(`[EVENT CONTROLLER] Deleting event ${req.params.id} by user ${req.user.id}`);
    await deleteEventService(req.params.id);

    res.status(204).send();
  } catch (err) {
    logger.error(`[EVENT CONTROLLER] Delete failed for ${req.params.id}: ${err.message}`);
    res.status(400).json({ status: 'error', meta: { message: err.message } });
  }
};
