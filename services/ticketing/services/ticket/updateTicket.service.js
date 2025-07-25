const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function updateTicket(id, data) {
  const start = Date.now();

  const ticket = await prisma.ticket.update({
    where: { id: Number(id) },
    data,
  });

  const duration = Date.now() - start;
  return { ticket, duration };
}

module.exports = { updateTicket };
