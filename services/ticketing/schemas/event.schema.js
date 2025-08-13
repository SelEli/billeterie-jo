const { getRedis } = require('../utils/redis.client');
const redis = getRedis();

/**
 * Met en cache un Event pour 15 minutes
 * @param {Object} event - L'objet complet de l'événement
 */
async function cacheEvent(event) {
  const key = `event:${event.id}`;
  await redis.set(key, JSON.stringify(event), 'EX', 900);
}

/**
 * Récupère un Event du cache si présent
 * @param {number|string} id - ID de l'événement
 * @returns {Object|null}
 */
async function getCachedEvent(id) {
  const data = await redis.get(`event:${id}`);
  return data ? JSON.parse(data) : null;
}

module.exports = { cacheEvent, getCachedEvent };
