const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function createTicket(data) {
  return prisma.ticket.create({ data });
}

module.exports = { createTicket };
