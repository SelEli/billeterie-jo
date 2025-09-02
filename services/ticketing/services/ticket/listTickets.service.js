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

  return prisma.ticket.findMany({
    where,
    select: {
      id: true,
      price: true,
      zone: true,
      status: true,
      createdAt: true,
      updatedAt: true,
      userId: true,
      eventId: true,
      offerId: true,
      signature: true, // on garde la signature si besoin pour QR
      // secretKey: false // implicite car non listé
    }
  });
}

module.exports = { listTicketsService };
