const prisma = require('../../utils/prismaClient');
const { getCachedOffer, cacheOffer } = require('../../cache/offer.cache');
const { timer } = require('../../monitor/monitor');

async function readOfferService(id) {
  const t = timer('readOfferService').start();
  try {
    const cached = await getCachedOffer(id);
    if (cached) return t.success(), cached;

    const offer = await prisma.offer.findUnique({ where: { id: Number(id) } });

    if (!offer || offer.deletedAt) {
      const err = new Error('Offer not found');
      err.statusCode = 404;
      throw err;
    }

    await cacheOffer(offer);
    t.success();
    return offer;
  } catch (err) {
    t.fail(err);
    throw err;
  }
}

module.exports = { readOfferService };
