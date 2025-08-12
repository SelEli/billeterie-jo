// services/ticket/updateTicket.service.js
const prisma = require('../../utils/prismaClient');

async function updateTicketService(id, data) {
  const ticket = await prisma.ticket.update({
    where: { id },
    data,
  });
  return ticket;
}

module.exports = { updateTicketService };
