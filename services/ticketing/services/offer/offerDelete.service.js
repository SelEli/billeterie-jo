// services/offer/offerDelete.service.js
const prisma = require('../../utils/prismaClient');
const { emitOfferDeleted } = require('../../kafka/offer.kafka');
const logger = require('../../utils/logger');
const { timer } = require('../../monitor/monitor');
const { invalidateOfferCache } = require('../../cache/offer.cache');

async function offerDeleteService(id) {
  const t = timer('offerDeleteService').start();
  try {
    const numericId = parseInt(id);

    const existing = await prisma.offer.findUnique({
      where: { id: numericId },
      select: { id: true, active: true }
    });
    if (!existing) throw new Error('Offer not found');

    if (!existing.active) {
      logger.warn(`Offer already inactive: ${numericId}`);
      t.success();
      return { id: numericId, active: false };
    }

    const deactivated = await prisma.offer.update({
      where: { id: numericId },
      data: { active: false }
    });

    await emitOfferDeleted(deactivated.id);
    await invalidateOfferCache(deactivated.id);

    logger.warn(`Offer deactivated (deleted): ${deactivated.id}`);
    t.success();
    return deactivated;
  } catch (err) {
    t.fail(err);
    throw err;
  }
}

module.exports = offerDeleteService;
