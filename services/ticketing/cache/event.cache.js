const { getRedis } = require('../utils/redisClient');
const redis = getRedis();

/**
 * Met en cache un événement pour 15 minutes
 * @param {Object} event - L'objet event complet
 */
async function cacheEvent(event) {
  const key = `event:${event.id}`;
  await redis.set(key, JSON.stringify(event), 'EX', 900);
}

/**
 * Récupère un événement du cache si présent
 * @param {number|string} id - ID de l'événement
 */
async function getCachedEvent(id) {
  const data = await redis.get(`event:${id}`);
  return data ? JSON.parse(data) : null;
}

module.exports = { cacheEvent, getCachedEvent };
