const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const { getRedis } = require('../../utils/redisClient');

async function readTicket(id) {
  const redis = getRedis?.();
  const cacheKey = `ticket:${id}`;

  if (redis) {
    const cached = await redis.get(cacheKey);
    if (cached) return JSON.parse(cached);
  }

  const ticket = await prisma.ticket.findUnique({ where: { id } });

  if (ticket && redis) {
    await redis.set(cacheKey, JSON.stringify(ticket), 'EX', 900);
  }

  return ticket;
}

module.exports = { readTicket };
