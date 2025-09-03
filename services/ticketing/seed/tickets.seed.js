// seeds/seedTickets.js
const prisma = require('../utils/prismaClient');
const logger = require('../utils/logger');

module.exports = async function seedTickets() {
  try {
    const ticketsData = [
      {
        userId: 1, // ID d'un user existant dans Auth
        eventId: 999,
        offerId: 101,
        zone: 'A',
        price: 70.0,
        status: 'RESERVED',
        secretKey: 'seed-secret-A',
        signature: 'seed-signature-A'
      },
      {
        userId: 2,
        eventId: 1000,
        offerId: null,
        zone: 'B',
        price: 120.0,
        status: 'VALID',
        secretKey: 'seed-secret-B',
        signature: 'seed-signature-B'
      },
      {
        userId: 1,
        eventId: null,
        offerId: 102,
        zone: 'C',
        price: 0.0,
        status: 'VALID',
        secretKey: 'seed-secret-C',
        signature: 'seed-signature-C'
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
