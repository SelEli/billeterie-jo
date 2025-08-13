// controllers/offer/readOffer.controller.js
const { offerReadService } = require('../../services/offer/offerQuery.service');
const logger = require('../../utils/logger');

module.exports = async (req, res) => {
  try {
    const offer = await offerReadService(req.params.id);
    if (!offer) {
      return res.status(404).json({ status: 'error', meta: { message: 'Offer not found' } });
    }
    logger.info(`Offer read: ${offer.id}`);
    res.json({ status: 'success', data: offer });
  } catch (err) {
    logger.error(err);
    res.status(400).json({ status: 'error', meta: { message: err.message } });
  }
};
