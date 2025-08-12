// services/ticket/listTickets.service.js
const prisma = require('../../utils/prismaClient');

async function listTicketsService(filter = {}) {
  const where = {};

  if (filter.userId) {
    const userId = Number(filter.userId);
    if (!isNaN(userId)) {
      where.userId = userId;
    }
  }
  if (filter.status) {
    where.status = filter.status;
  }

  return prisma.ticket.findMany({ where });
}

module.exports = { listTicketsService };
