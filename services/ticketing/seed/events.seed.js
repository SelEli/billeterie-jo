const prisma = require('../utils/prismaClient');

module.exports = async function seedEvents() {
  await prisma.event.createMany({
    data: [
      {
        id: 999,
        label: 'Cérémonie Ouverture',
        date: new Date('2025-07-26T20:00:00'),
        location: 'Stade Olympique',
        category: 'CEREMONIE',
        deletedAt: null
      },
      {
        id: 1000,
        label: 'Finale 100m Hommes',
        date: new Date('2025-08-04T18:00:00'),
        location: 'Stade Olympique',
        category: 'ATHLETISME',
        deletedAt: null
      }
    ],
    skipDuplicates: true
  });

  console.log('✅ Events seeded');
};
