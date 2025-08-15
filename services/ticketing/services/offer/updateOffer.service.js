const prisma = require('../../utils/prismaClient');
const { emitOfferUpdated } = require('../../kafka/offer.kafka');
const logger = require('../../utils/logger');
const { timer } = require('../../monitor/monitor');
const { cacheOffer } = require('../../cache/offer.cache');

async function updateOfferService(id, data) {
  const t = timer('updateOfferService').start();
  try {
    const offerId = Number(id);
    const existing = await prisma.offer.findUnique({
      where: { id: offerId },
      select: { deletedAt: true }
    });

    if (!existing || existing.deletedAt) {
      const err = new Error('Offer not found'); // harmonisé
      err.statusCode = 404;
      throw err;
    }

    const updated = await prisma.offer.update({ where: { id: offerId }, data });

    await emitOfferUpdated({ id: updated.id, changes: data });
    await cacheOffer(updated);
    logger.info(`[OFFER] Updated: ${updated.id}`);

    t.success();
    return updated;
  } catch (err) {
    logger.error(`[OFFER] Failed to update ${id}: ${err.message}`);
    t.fail(err);
    throw err;
  }
}

module.exports = { updateOfferService };
