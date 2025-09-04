// seeds/events.seed.js
const prisma = require('../utils/prismaClient');
const logger = require('../utils/logger');

module.exports = async function seedEvents() {
  try {
    const eventsData = [
      {
        id: 999,
        label: 'Cérémonie Ouverture',
        date: new Date('2025-07-26T20:00:00Z'),
        location: 'Stade Olympique',
        category: 'CEREMONIE',
        deletedAt: null
      },
      {
        id: 1000,
        label: 'Finale 100m Hommes',
        date: new Date('2025-08-04T18:00:00Z'),
        location: 'Stade Olympique',
        category: 'ATHLETISME',
        deletedAt: null
      }
    ];

    const result = await prisma.event.createMany({
      data: eventsData,
      skipDuplicates: true
    });

    logger.info(`✅ Events seeded (${result.count} inserted or skipped)`);
  } catch (error) {
    logger.error('❌ Failed to seed events', { error: error.message });
    process.exitCode = 1;
  } finally {
    await prisma.$disconnect();
  }
};
