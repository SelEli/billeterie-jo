const bcrypt = require('bcrypt');
const prisma = require('../utils/prismaClient');
const logger = require('../utils/logger');

module.exports = async function seedUsers() {
  try {
    logger.debug('[SEED][USERS] Starting users seeding process');

    const passwordHash = await bcrypt.hash('Password123!', 10);

    const usersData = [
      // ADMIN
      {
        id: 1,
        email: 'admin@jo.fr',
        hash: passwordHash,
        firstName: 'Admin',
        lastName: 'User',
        birthDate: new Date('1980-01-01'),
        role: 'ADMIN',
        invisibleKey: 'key-admin',
        isBlacklisted: false
      },
      // AGENT
      {
        id: 2,
        email: 'agent@jo.fr',
        hash: passwordHash,
        firstName: 'Agent',
        lastName: 'Smith',
        birthDate: new Date('1985-05-05'),
        role: 'AGENT',
        invisibleKey: 'key-agent',
        isBlacklisted: false
      },
      // USER
      {
        id: 3,
        email: 'user1@jo.fr',
        hash: passwordHash,
        firstName: 'User',
        lastName: 'One',
        birthDate: new Date('1990-01-01'),
        role: 'USER',
        invisibleKey: 'key-user-1',
        isBlacklisted: false
      },
      {
        id: 4,
        email: 'user2@jo.fr',
        hash: passwordHash,
        firstName: 'User',
        lastName: 'Two',
        birthDate: new Date('1992-02-02'),
        role: 'USER',
        invisibleKey: 'key-user-2',
        isBlacklisted: false
      },
      // VISITOR
      {
        id: 5,
        email: 'visitor@jo.fr',
        hash: passwordHash,
        firstName: 'Guest',
        lastName: 'Visitor',
        birthDate: new Date('1995-12-12'),
        role: 'VISITOR',
        invisibleKey: 'key-visitor',
        isBlacklisted: false
      },
      // EMPLOYEE
      {
        id: 6,
        email: 'employee@jo.fr',
        hash: passwordHash,
        firstName: 'Evan',
        lastName: 'Employee',
        birthDate: new Date('1988-03-15'),
        role: 'EMPLOYEE',
        invisibleKey: 'key-employee',
        isBlacklisted: false
      }
    ];

    const result = await prisma.user.createMany({
      data: usersData,
      skipDuplicates: true
    });

    logger.info(`✅ Users seeded successfully (${result.count} inserted or skipped)`);
  } catch (error) {
    logger.error('❌ Failed to seed users', { error: error.message });
    process.exitCode = 1;
  } finally {
    await prisma.$disconnect();
    logger.debug('[SEED][USERS] Prisma disconnected');
  }
};
