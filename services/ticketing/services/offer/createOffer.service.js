const prisma = require('../../utils/prismaClient');
const { emitOfferCreated } = require('../../kafka/offer.kafka');
const logger = require('../../utils/logger');
const { timer } = require('../../monitor/monitor');
const { cacheOffer } = require('../../cache/offer.cache');

async function createOfferService(data) {
  const t = timer('createOfferService').start();
  try {
    // Validation stricte : null/undefined ou chaîne vide
    ['label', 'price', 'eventId'].forEach((f) => {
      if (
        data[f] === undefined ||
        data[f] === null ||
        (typeof data[f] === 'string' && !data[f].trim())
      ) {
        const err = new Error(`${f} is required`);
        err.statusCode = 400;
        throw err;
      }
    });

    const offer = await prisma.offer.create({ data });

    await emitOfferCreated({ id: offer.id, label: offer.label });
    await cacheOffer(offer);
    logger.info(`[OFFER] Created: ${offer.id}`);

    t.success();
    return offer;
  } catch (err) {
    logger.error(`[OFFER] Failed to create: ${err.message}`);
    t.fail(err);
    throw err;
  }
}

module.exports = { createOfferService };
