const { getRedis } = require('../utils/redis.client');
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

module.exports = { cacheOffer, getCachedOffer };
