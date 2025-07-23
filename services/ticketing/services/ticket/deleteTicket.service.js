const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function deleteTicket(id) {
  return prisma.ticket.delete({ where: { id } });
}

module.exports = { deleteTicket };
