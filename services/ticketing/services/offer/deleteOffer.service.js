const prisma = require('../../utils/prismaClient');
const { emitOfferDeleted } = require('../../kafka/offer.kafka');
const logger = require('../../utils/logger');
const { timer } = require('../../monitor/monitor');
const { invalidateOfferCache } = require('../../cache/offer.cache');

async function deleteOfferService(id) {
  const t = timer('deleteOfferService').start();
  try {
    const offerId = Number(id);
    const existing = await prisma.offer.findUnique({
      where: { id: offerId },
      select: { deletedAt: true }
    });

    if (!existing) {
      const err = new Error('Offer not found');
      err.statusCode = 404;
      throw err;
    }

    if (existing.deletedAt) {
      logger.info(`[OFFER] Already deleted: ${offerId}`);
      t.success();
      return { id: offerId, deletedAt: existing.deletedAt };
    }

    const deleted = await prisma.offer.update({
      where: { id: offerId },
      data: { deletedAt: new Date() }
    });

    await emitOfferDeleted(deleted.id);
    await invalidateOfferCache(deleted.id);
    logger.info(`[OFFER] Deleted: ${deleted.id}`);

    t.success();
    return deleted;
  } catch (err) {
    logger.error(`[OFFER] Failed to delete ${id}: ${err.message}`);
    t.fail(err);
    throw err;
  }
}

module.exports = { deleteOfferService };
