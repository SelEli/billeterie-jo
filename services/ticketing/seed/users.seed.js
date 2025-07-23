const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

module.exports = async function seedUsers() {
  await prisma.user.createMany({
    data: [
      { id: 1, email: 'user1@jo.fr', role: 'USER' },
      { id: 2, email: 'user2@jo.fr', role: 'USER' }
    ]
  });
  console.log('Users seeded');
};
