const prisma = require('../../utils/prismaClient');
const { emitOfferUpdated } = require('../../kafka/offer.kafka');
const logger = require('../../utils/logger');
const { timer } = require('../../monitor/monitor');
const { cacheOffer } = require('../../cache/offer.cache');
const { ERROR_STATUS } = require('../../utils/httpErrorMap');

async function updateOfferService(id, data) {
  const t = timer('updateOfferService').start();
  const offerId = Number(id);

  if (!Number.isInteger(offerId) || offerId <= 0) {
    const err = new Error('INVALID_OFFER_ID');
    err.statusCode = ERROR_STATUS.INVALID_OFFER_ID;
    throw err;
  }

  let updated;
  try {
    updated = await prisma.offer.update({
      where: { id: offerId },
      data
    });
  } catch {
    const err = new Error('OFFER_NOT_FOUND');
    err.statusCode = ERROR_STATUS.OFFER_NOT_FOUND;
    throw err;
  }

  logger.info(`[OFFER] Updated: ${updated.id}`);

  try {
    await emitOfferUpdated({ id: updated.id, changes: data });
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
}

module.exports = { updateOfferService };
