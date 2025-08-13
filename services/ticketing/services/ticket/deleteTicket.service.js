// services/ticket/deleteTicket.service.js
const prisma = require('../../utils/prismaClient');

async function deleteTicketService(id) {
  const numericId = typeof id === 'string' ? Number(id) : id;
  return prisma.ticket.delete({ where: { id: numericId } });
}

module.exports = { deleteTicketService };
