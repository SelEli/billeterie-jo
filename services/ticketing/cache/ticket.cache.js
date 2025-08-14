const { getRedis } = require('../utils/redisClient');
const redis = getRedis();

async function cacheTicket(ticket) {
  const key = `ticket:${ticket.id}`;
  await redis.set(key, JSON.stringify(ticket), 'EX', 900);
}

async function getCachedTicket(id) {
  const data = await redis.get(`ticket:${id}`);
  return data ? JSON.parse(data) : null;
}

module.exports = { cacheTicket, getCachedTicket };
