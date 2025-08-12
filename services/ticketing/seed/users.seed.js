const prisma = require('../utils/prismaClient'); // charge l’instance déjà créée


module.exports = async function seedUsers() {
  await prisma.user.createMany({
    data: [
      {
        id: 1,
        email: 'user1@jo.fr',
        hash: 'fake-hash-1',
        role: 'USER',
        invisibleKey: 'key-user-1'
      },
      {
        id: 2,
        email: 'user2@jo.fr',
        hash: 'fake-hash-2',
        role: 'USER',
        invisibleKey: 'key-user-2'
      }
    ],
    skipDuplicates: true
  });

  console.log('✅ Users seeded');
};
