// services/ticket/deleteTicket.service.js
const prisma = require('../../utils/prismaClient');

async function deleteTicketService(id) {
  return prisma.ticket.delete({ where: { id } });
}

module.exports = { deleteTicketService };
