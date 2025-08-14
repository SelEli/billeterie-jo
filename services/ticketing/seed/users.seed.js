// seeds/seedUsers.js
const prisma = require('../utils/prismaClient'); // instance Prisma partagée
const logger = require('../utils/logger');

module.exports = async function seedUsers() {
  try {
    const usersData = [
      {
        id: 1,
        email: 'user1@jo.fr',
        hash: 'fake-hash-1', // valeur de hash simulée
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
    ];

    const result = await prisma.user.createMany({
      data: usersData,
      skipDuplicates: true
    });

    logger.info(`✅ Users seeded (${result.count} inserted or skipped)`);
  } catch (error) {
    logger.error('❌ Failed to seed users', { error: error.message });
    process.exitCode = 1; // utile en mode CLI pour signaler un échec
  } finally {
    await prisma.$disconnect();
  }
};
