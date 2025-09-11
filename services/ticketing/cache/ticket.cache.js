const { getRedis } = require('../utils/redisClient');
const redis = getRedis();

/**
 * Met un ticket en cache Redis
 * @param {object} ticket - Objet ticket complet
 */
async function cacheTicket(ticket) {
  const key = `ticket:${ticket.id}`;
  await redis.set(key, JSON.stringify(ticket), 'EX', 900); // TTL 15 min
}

/**
 * Récupère un ticket depuis le cache Redis
 * @param {number} id - ID du ticket
 * @returns {object|null}
 */
async function getCachedTicket(id) {
  const data = await redis.get(`ticket:${id}`);
  return data ? JSON.parse(data) : null;
}

/**
 * Invalide un ticket dans le cache Redis
 * @param {number} id - ID du ticket
 */
async function invalidateCachedTicket(id) {
  await redis.del(`ticket:${id}`);
}

module.exports = {
  cacheTicket,
  getCachedTicket,
  invalidateCachedTicket
};
