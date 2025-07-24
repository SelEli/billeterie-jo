const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

module.exports = async function seedOffers() {
  await prisma.offer.createMany({
    data: [
      {
        id: 101,
        label: 'Pack Jeunesse',
        discount: 30,
        targetRole: 'USER'
      },
      {
        id: 102,
        label: 'Staff Gratuit',
        discount: 100,
        targetRole: 'EMPLOYEE'
      }
    ],
    skipDuplicates: true
  });

  console.log('✅ Offers seeded');
};
