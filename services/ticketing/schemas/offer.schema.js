const { getRedis } = require('../utils/redisClient');
const redis = getRedis();

/**
 * Met en cache une Offer pour 15 minutes
 * @param {Object} offer - L'objet complet de l'offre
 */
async function cacheOffer(offer) {
  const key = `offer:${offer.id}`;
  await redis.set(key, JSON.stringify(offer), 'EX', 900);
}

/**
 * Récupère une Offer du cache si présente
 * @param {number|string} id - ID de l'offre
 * @returns {Object|null}
 */
async function getCachedOffer(id) {
  const data = await redis.get(`offer:${id}`);
  return data ? JSON.parse(data) : null;
}

/**
 * Supprime une Offer du cache (invalidation)
 * @param {number|string} id - ID de l'offre
 */
async function invalidateOfferCache(id) {
  await redis.del(`offer:${id}`);
}

module.exports = { cacheOffer, getCachedOffer, invalidateOfferCache };
