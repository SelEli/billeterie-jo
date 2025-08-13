// controllers/event/deleteEvent.controller.js
const eventDeleteService = require('../../services/event/eventDelete.service');
const logger = require('../../utils/logger');

module.exports = async (req, res) => {
  try {
    if (req.user.role !== 'ADMIN') {
      return res.status(403).json({ status: 'error', meta: { message: 'Forbidden' } });
    }

    await eventDeleteService(req.params.id);
    res.status(204).send();
  } catch (err) {
    logger.error(err);
    res.status(400).json({ status: 'error', meta: { message: err.message } });
  }
};
