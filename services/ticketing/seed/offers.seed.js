const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

module.exports = async function seedOffers() {
  await prisma.offer.createMany({
    data: [
      { id: 101, name: 'Pack Jeunesse', discount: 30, targetRole: 'USER' },
      { id: 102, name: 'Staff Gratuit', discount: 100, targetRole: 'EMPLOYEE' }
    ]
  });
  console.log('Offers seeded');
};
