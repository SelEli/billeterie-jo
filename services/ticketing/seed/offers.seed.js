// seeds/seedOffers.js
const prisma = require('../utils/prismaClient');
const logger = require('../utils/logger');

module.exports = async function seedOffers() {
  try {
    const offersData = [
      {
        id: 101,
        label: 'Pack Jeunesse',
        discount: 0.3, // 30% en décimal
        active: true,
        targetRole: 'USER',
        eventId: 999,
        validFrom: new Date(),
        validTo: new Date(Date.now() + 7 * 86400000), // +7 jours
        quota: 100
      },
      {
        id: 102,
        label: 'Staff Gratuit',
        discount: 1.0, // 100% en décimal
        active: true,
        targetRole: 'EMPLOYEE',
        eventId: null,
        validFrom: null,
        validTo: null,
        quota: null
      },
      {
        id: 103,
        label: 'Promo Éclair',
        discount: 0.15, // 15%
        active: false,
        targetRole: 'USER',
        eventId: 1000,
        validFrom: new Date(Date.now() - 5 * 86400000), // -5 jours
        validTo: new Date(Date.now() - 1 * 86400000),   // -1 jour
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
