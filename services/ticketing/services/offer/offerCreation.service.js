// services/offer/offerCreation.service.js
const prisma = require('../../utils/prismaClient');
const { emitOfferCreated } = require('../../kafka/offer.kafka');
const logger = require('../../utils/logger');
const { timer } = require('../../monitor/monitor');
const { cacheOffer } = require('../../cache/offer.cache');

async function offerCreationService(data) {
  const t = timer('offerCreationService').start();
  try {
    if (data.eventId) {
      const ev = await prisma.event.findUnique({
        where: { id: data.eventId },
        select: { id: true, deletedAt: true }
      });
      if (!ev || ev.deletedAt) throw new Error('Linked event not found or deleted');
    }

    const offer = await prisma.offer.create({ data });

    await emitOfferCreated({
      id: offer.id,
      label: offer.label,
      discount: offer.discount,
      active: offer.active,
      targetRole: offer.targetRole,
      eventId: offer.eventId || null,
      validFrom: offer.validFrom || null,
      validTo: offer.validTo || null,
      quota: offer.quota || null
    });

    await cacheOffer(offer);

    logger.info(`Offer created: ${offer.id}`);
    t.success();
    return offer;
  } catch (err) {
    t.fail(err);
    throw err;
  }
}

module.exports = offerCreationService;
