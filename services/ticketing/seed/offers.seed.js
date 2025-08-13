const prisma = require('../utils/prismaClient');

module.exports = async function seedOffers() {
  await prisma.offer.createMany({
    data: [
      {
        id: 101,
        label: 'Pack Jeunesse',
        discount: 0.3, // 30% en décimal
        active: true,
        targetRole: 'USER',
        eventId: 999,
        validFrom: new Date(),
        validTo: new Date(Date.now() + 7 * 86400000),
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
        discount: 0.15,
        active: false,
        targetRole: 'USER',
        eventId: 1000,
        validFrom: new Date(Date.now() - 5 * 86400000),
        validTo: new Date(Date.now() - 1 * 86400000),
        quota: 0
      }
    ],
    skipDuplicates: true
  });

  console.log('✅ Offers seeded');
};
