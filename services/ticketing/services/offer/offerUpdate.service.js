// services/offer/offerUpdate.service.js
const prisma = require('../../prisma/client');
const { emitOfferUpdated } = require('../../kafka/offer.kafka');
const logger = require('../../utils/logger');
const { timer } = require('../../monitor/monitor');

async function offerUpdateService(id, data) {
  const t = timer('offerUpdateService').start();
  try {
    const numericId = parseInt(id);

    // Vérifier l'existence
    const existing = await prisma.offer.findUnique({
      where: { id: numericId },
      select: { id: true, active: true }
    });
    if (!existing) throw new Error('Offer not found');

    // Si on relie à un event, s'assurer qu'il est valide
    if (data.eventId) {
      const ev = await prisma.event.findUnique({
        where: { id: data.eventId },
        select: { id: true, deletedAt: true }
      });
      if (!ev || ev.deletedAt) throw new Error('Linked event not found or deleted');
    }

    const updated = await prisma.offer.update({
      where: { id: numericId },
      data
    });

    await emitOfferUpdated({ id: updated.id, changes: data });
    logger.info(`Offer updated: ${updated.id}`);
    t.success();
    return updated;
  } catch (err) {
    t.fail(err);
    throw err;
  }
}

module.exports = offerUpdateService;
