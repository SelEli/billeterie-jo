const prisma = require('../../utils/prismaClient');
const { emitOfferUpdated } = require('../../kafka/offer.kafka');
const logger = require('../../utils/logger');
const { timer } = require('../../monitor/monitor');
const { cacheOffer } = require('../../cache/offer.cache');
const { ERROR_STATUS } = require('../../utils/httpErrorMap');
const { updateOfferSchema } = require('../../schemas/offer.schema');

async function updateOfferService(id, data) {
  const t = timer('updateOfferService').start();
  const offerId = Number(id);

  if (!Number.isInteger(offerId) || offerId <= 0) {
    const err = new Error('INVALID_OFFER_ID');
    err.statusCode = ERROR_STATUS.INVALID_OFFER_ID;
    throw err;
  }

  try {
    // ✅ Validation et transformation par Zod
    const parsed = updateOfferSchema.parse(data);

    // ✅ Mapping Prisma
    const prismaData = {
      label: parsed.label,
      discount: parsed.discount,
      active: parsed.active,
      validFrom: parsed.validFrom ?? null,
      validTo: parsed.validTo ?? null,
      quota: parsed.quota ?? null
    };

    const updated = await prisma.offer.update({
      where: { id: offerId },
      data: prismaData
    });

    logger.info(`[OFFER] Updated: ${updated.id}`);

    try {
      await emitOfferUpdated({ id: updated.id, changes: parsed });
    } catch (emitErr) {
      logger.warn(`[OFFER] emitOfferUpdated failed: ${emitErr.message}`);
    }

    try {
      await cacheOffer(updated);
    } catch (cacheErr) {
      logger.warn(`[OFFER] cacheOffer failed: ${cacheErr.message}`);
    }

    t.success();
    return updated;
  } catch (err) {
    logger.error(`[OFFER] Failed to update: ${err.message}`);
    t.fail(err);
    if (!err.statusCode) {
      err.statusCode = ERROR_STATUS.INTERNAL_SERVER_ERROR;
    }
    throw err;
  }
}

module.exports = { updateOfferService };
