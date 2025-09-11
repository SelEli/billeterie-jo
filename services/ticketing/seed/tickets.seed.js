// seeds/tickets.seed.js
const prisma = require('../utils/prismaClient');
const logger = require('../utils/logger');

module.exports = async function seedTickets() {
  try {
    const ticketsData = [
      {
        userId: 1,
        eventId: 1,       // Event existant (ex: Cérémonie ouverture JO)
        offerId: 1,       // Offer existante liée à eventId: 1
        zone: 'A',
        price: 70.0,
        status: 'RESERVED',
        secretKey: 'seed-secret-A',
        signature: null   // pas de signature tant que pas VALID
      },
      {
        userId: 2,
        eventId: 2,       // Event existant (ex: Finale 100m)
        offerId: null,    // Pas d'offre
        zone: 'B',
        price: 120.0,
        status: 'VALID',  // déjà validé → signature présente
        secretKey: 'seed-secret-B',
        signature: 'seed-signature-B'
      },
      {
        userId: 3,
        eventId: 1,
        offerId: 2,       // Offer existante liée à eventId: 1
        zone: 'C',
        price: 50.0,
        status: 'RESERVED',
        secretKey: 'seed-secret-C',
        signature: null
      }
    ];

    const result = await prisma.ticket.createMany({
      data: ticketsData,
      skipDuplicates: true
    });

    logger.info(`✅ Tickets seeded (${result.count} inserted or skipped)`);
  } catch (error) {
    logger.error('❌ Failed to seed tickets', { error: error.message });
    process.exitCode = 1;
  } finally {
    await prisma.$disconnect();
  }
};
