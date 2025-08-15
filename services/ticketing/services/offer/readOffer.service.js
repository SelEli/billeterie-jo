// services/offer/readOffer.service.js
const prisma = require('../../utils/prismaClient');
const { getCachedOffer, cacheOffer } = require('../../cache/offer.cache');
const { timer } = require('../../monitor/monitor');

async function readOfferService(id) {
  const t = timer('readOfferService').start();
  try {
    // Vérifie d'abord dans le cache
    const cached = await getCachedOffer(id);
    if (cached) {
      t.success();
      // On renvoie l'objet complet, comme dans le cache
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
    // Renvoie toutes les clés intactes (mock attendu dans les tests)
    return { ...offer };
  } catch (err) {
    t.fail(err);
    throw err;
  }
}

module.exports = { readOfferService };
