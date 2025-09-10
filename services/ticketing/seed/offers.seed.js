// seeds/offers.seed.js
const prisma = require('../utils/prismaClient');
const logger = require('../utils/logger');

module.exports = async function seedOffers() {
  try {
    const offersData = [
      {
        id: 1,
        label: 'Simple',
        discount: 0,
        active: true,
        eventId: 1,
        validFrom: new Date(),
        validTo: new Date(Date.now() + 30 * 86400000),
        quota: 100
      },
      {
        id: 2,
        label: 'Duo',
        discount: 0.10,
        active: true,
        eventId: 1,
        validFrom: new Date(),
        validTo: new Date(Date.now() + 30 * 86400000),
        quota: 50
      },
      {
        id: 3,
        label: 'Famille',
        discount: 0.20,
        active: true,
        eventId: 2,
        validFrom: new Date(),
        validTo: new Date(Date.now() + 30 * 86400000),
        quota: 30
      }
    ];

    const result = await prisma.offer.createMany({
      data: offersData,
      skipDuplicates: true
    });

    logger.info(`✅ Offers seeded (${result.count} inserted or skipped)`);
  } catch (error) {
    logger.error('❌ Failed to seed offers', { error: error.message });
    process.exitCode = 1;
  } finally {
    await prisma.$disconnect();
  }
};
