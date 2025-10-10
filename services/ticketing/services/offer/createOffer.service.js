const prisma = require('../../utils/prismaClient');
const { emitOfferCreated } = require('../../kafka/offer.kafka');
const logger = require('../../utils/logger');
const { timer } = require('../../monitor/monitor');
const { cacheOffer } = require('../../cache/offer.cache');
const { ERROR_STATUS } = require('../../utils/httpErrorMap');

async function createOfferService(data) {
  const t = timer('createOfferService').start();

  try {
    // On laisse Zod transformer les dates, pas de new Date ici
    const safeData = {
      label: data.label ?? null,
      discount: data.discount ?? null,
      active: data.active ?? true,
      validFrom: data.validFrom ?? null,
      validTo: data.validTo ?? null,
      quota: data.quota ?? null,
      eventId: data.eventId ?? null
    };

    const offer = await prisma.offer.create({ data: safeData });

    try {
      await emitOfferCreated({ id: offer.id, label: offer.label });
    } catch (emitErr) {
      logger.warn(`[OFFER] emitOfferCreated failed: ${emitErr.message}`);
    }

    try {
      await cacheOffer(offer);
    } catch (cacheErr) {
      logger.warn(`[OFFER] cacheOffer failed: ${cacheErr.message}`);
    }

    logger.info(`[OFFER] Created: ${offer.id}`);
    t.success();
    return offer;

  } catch (err) {
    logger.error(`[OFFER] Failed to create: ${err.message}`);
    t.fail(err);
    err.statusCode = err.statusCode || ERROR_STATUS.INTERNAL_SERVER_ERROR;
    throw err;
  }
}

module.exports = { createOfferService };
