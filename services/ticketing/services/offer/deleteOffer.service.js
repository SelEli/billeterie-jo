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
      select: { id: true } // ✅ supprimé deletedAt : champ inexistant dans le modèle
    });

    if (!existing) {
      const err = new Error('Offer not found');
      err.statusCode = 404;
      throw err;
    }

    // Pas de soft delete possible → on supprime directement
    const deleted = await prisma.offer.delete({
      where: { id: offerId }
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
