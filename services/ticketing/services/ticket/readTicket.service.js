// services/ticket/readTicket.service.js
const prisma = require('../../utils/prismaClient');
const { getRedis } = require('../../utils/redisClient');

async function readTicketService(id) {
  const redis = getRedis?.();
  const cacheKey = `ticket:${id}`;

  if (redis) {
    const cached = await redis.get(cacheKey);
    if (cached) {
      return JSON.parse(cached);
    }
  }

  const ticket = await prisma.ticket.findUnique({ where: { id } });

  if (ticket && redis) {
    await redis.set(cacheKey, JSON.stringify(ticket), 'EX', 900);
  }

  return ticket;
}

module.exports = { readTicketService };
