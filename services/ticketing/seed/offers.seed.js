// seeds/offers.seed.js
const prisma = require('../utils/prismaClient');
const logger = require('../utils/logger');

module.exports = async function seedOffers() {
  try {
    const offersData = [
      {
        id: 101,
        label: 'Pack Jeunesse',
        discount: 0.3,
        active: true,
        eventId: 999,
        validFrom: new Date(),
        validTo: new Date(Date.now() + 7 * 86400000),
        quota: 100
      },
      {
        id: 103,
        label: 'Promo Éclair',
        discount: 0.15,
        active: false,
        eventId: 1000,
        validFrom: new Date(Date.now() - 5 * 86400000),
        validTo: new Date(Date.now() - 1 * 86400000),
        quota: 0
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
