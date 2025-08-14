// seeds/seedTickets.js
const prisma = require('../utils/prismaClient');
const logger = require('../utils/logger');

module.exports = async function seedTickets() {
  try {
    const ticketsData = [
      {
        userId: 1,
        eventId: 999,
        offerId: 101,
        zone: 'A',
        price: 70.0,
        status: 'RESERVED'
      },
      {
        userId: 2,
        eventId: 1000,
        offerId: null,
        zone: 'B',
        price: 120.0,
        status: 'VALID'
      },
      {
        userId: 1,
        eventId: null,
        offerId: 102,
        zone: 'C',
        price: 0.0,
        status: 'VALID'
      }
    ];

    const result = await prisma.ticket.createMany({
      data: ticketsData,
      skipDuplicates: true
    });

    logger.info(`✅ Tickets seeded (${result.count} inserted or skipped)`);
  } catch (error) {
    logger.error('❌ Failed to seed tickets', { error: error.message });
    process.exitCode = 1; // utile si utilisé en CLI
  } finally {
    await prisma.$disconnect();
  }
};
