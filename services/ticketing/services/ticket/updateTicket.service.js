// services/ticket/updateTicket.service.js
const prisma = require('../../utils/prismaClient');

async function updateTicketService(id, data) {
  const numericId = typeof id === 'string' ? Number(id) : id;

  const ticket = await prisma.ticket.update({
    where: { id: numericId },
    data,
  });
  return ticket;
}

module.exports = { updateTicketService };
