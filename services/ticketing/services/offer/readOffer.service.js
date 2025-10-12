const prisma = require('../../utils/prismaClient');
const { getCachedOffer, cacheOffer } = require('../../cache/offer.cache');
const { timer } = require('../../monitor/monitor');

async function readOfferService(id) {
  const t = timer('readOfferService').start();
  try {
    const offerId = Number(id);
    if (isNaN(offerId)) {
      const err = new Error('Invalid offer ID');
      err.statusCode = 400;
      throw err;
    }

    // Vérifie d'abord dans le cache
    const cached = await getCachedOffer(offerId);
    if (cached && !cached.deletedAt) {
      t.success();
      return { ...cached };
    }

    // Récupère l’offre
    const offer = await prisma.offer.findUnique({
      where: { id: offerId },
      include: { tickets: true }
    });

    if (!offer || offer.deletedAt) {
      const err = new Error('Offer not found');
      err.statusCode = 404;
      throw err;
    }

    await cacheOffer(offer);

    t.success();
    return { ...offer };
  } catch (err) {
    t.fail(err);
    throw err;
  }
}

module.exports = { readOfferService };
