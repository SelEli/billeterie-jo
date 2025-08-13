const { getRedis } = require('../utils/redis.client');
const redis = getRedis();

/**
 * Met en cache une offre pour 15 minutes
 * @param {Object} offer - L'objet offer complet
 */
async function cacheOffer(offer) {
  const key = `offer:${offer.id}`;
  await redis.set(key, JSON.stringify(offer), 'EX', 900);
}

/**
 * Récupère une offre du cache si présente
 * @param {number|string} id - ID de l'offre
 */
async function getCachedOffer(id) {
  const data = await redis.get(`offer:${id}`);
  return data ? JSON.parse(data) : null;
}

module.exports = { cacheOffer, getCachedOffer };
