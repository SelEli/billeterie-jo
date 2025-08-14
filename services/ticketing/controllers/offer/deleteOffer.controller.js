const { deleteOfferService } = require('../../services/offer/deleteOffer.service');
const logger = require('../../utils/logger');

module.exports = async (req, res) => {
  try {
    if (req.user.role !== 'ADMIN') {
      return res.status(403).json({ status: 'error', meta: { message: 'Forbidden' } });
    }

    logger.info(`[OFFER CONTROLLER] Deleting offer ${req.params.id} by user ${req.user.id}`);
    await deleteOfferService(req.params.id);
    res.status(204).send();
  } catch (err) {
    logger.error(`[OFFER CONTROLLER] Delete failed for ${req.params.id}: ${err.message}`);
    res.status(400).json({ status: 'error', meta: { message: err.message } });
  }
};
