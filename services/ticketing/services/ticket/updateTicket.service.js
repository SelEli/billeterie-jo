const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function updateTicket({ id, ...data }) {
  return prisma.ticket.update({
    where: { id },
    data
  });
}

module.exports = { updateTicket };
