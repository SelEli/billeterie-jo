const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function listTickets(filter) {
  const where = {};
  if (filter.userId) where.userId = Number(filter.userId);
  if (filter.status) where.status = filter.status;
  return prisma.ticket.findMany({ where });
}

module.exports = { listTickets };
