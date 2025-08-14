const { readOfferService } = require('../../services/offer/readOffer.service');
const logger = require('../../utils/logger');

module.exports = async (req, res) => {
  try {
    logger.debug(`[OFFER CONTROLLER] Reading offer ${req.params.id}`);
    const offer = await readOfferService(req.params.id);

    if (!offer) {
      return res.status(404).json({ status: 'error', meta: { message: 'Offer not found' } });
    }

    logger.info(`[OFFER CONTROLLER] Offer read: ${offer.id}`);
    res.json({ status: 'success', data: offer });
  } catch (err) {
    logger.error(`[OFFER CONTROLLER] Read failed for ${req.params.id}: ${err.message}`);
    res.status(400).json({ status: 'error', meta: { message: err.message } });
  }
};
