const prisma = require('../utils/prismaClient'); // charge l’instance déjà créée


module.exports = async function seedEvents() {
  await prisma.event.createMany({
    data: [
      {
        id: 999,
        label: 'Cérémonie Ouverture',
        date: new Date('2025-07-26T20:00:00'),
        location: 'Stade Olympique'
      }
    ],
    skipDuplicates: true
  });

  console.log('✅ Events seeded');
};
