// services/offer/readOffer.service.js
const prisma = require('../../utils/prismaClient');
const { getCachedOffer, cacheOffer } = require('../../cache/offer.cache');
const { timer } = require('../../monitor/monitor');

function isComplete(offer) {
  return offer &&
    typeof offer === 'object' &&
    'label' in offer &&
    'discount' in offer &&
    'targetRole' in offer &&
    'eventId' in offer &&
    'active' in offer;
}

async function readOfferService(id) {
  const t = timer('readOfferService').start();
  try {
    // Vérifie d'abord dans le cache
    const cached = await getCachedOffer(id);
    if (cached && isComplete(cached) && !cached.deletedAt) {
      t.success();
      return { ...cached };
    }

    // Récupère toutes les propriétés sans select restreint
    const offer = await prisma.offer.findUnique({
      where: { id: Number(id) }
    });

    // Not found ou supprimé
    if (!offer || offer.deletedAt) {
      const err = new Error('Offer not found');
      err.statusCode = 404;
      throw err;
    }

    // Met en cache pour appels suivants
    await cacheOffer(offer);

    t.success();
    return { ...offer };
  } catch (err) {
    t.fail(err);
    throw err;
  }
}

module.exports = { readOfferService };
