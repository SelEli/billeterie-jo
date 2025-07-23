const { PrismaClient } = require('@prisma/client');
const { getRedis } = require('../../../utils/redis.client');
const redis = getRedis();

async function readTicket(id) {
  const cacheKey = `ticket:${id}`;
  const cached = await redis.get(cacheKey);
  if (cached) return JSON.parse(cached);

  const ticket = await new PrismaClient().ticket.findUnique({ where: { id } });
  if (ticket) {
    await redis.set(cacheKey, JSON.stringify(ticket), 'EX', 900);
  }
  return ticket;
}

module.exports = { readTicket };
