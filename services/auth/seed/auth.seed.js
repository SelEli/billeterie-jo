// seeds/seedAuth.js
const bcrypt = require('bcrypt');
const prisma = require('../utils/prismaClient');
const logger = require('../utils/logger');

module.exports = async function seedAuth() {
  try {
    logger.debug('[SEED][AUTH] Starting Auth users seeding process');

    const passwordHash = await bcrypt.hash('Password123!', 10);

    const usersData = [
      {
        email: 'admin@example.com',
        hash: passwordHash,
        firstName: 'Alice',
        lastName: 'Admin',
        birthDate: new Date('1980-01-01'),
        role: 'ADMIN',
        invisibleKey: 'admin-key',
        isBlacklisted: false
      },
      {
        email: 'agent@example.com',
        hash: passwordHash,
        firstName: 'Bob',
        lastName: 'Agent',
        birthDate: new Date('1985-05-05'),
        role: 'AGENT',
        invisibleKey: 'agent-key',
        isBlacklisted: false
      },
      {
        email: 'user@example.com',
        hash: passwordHash,
        firstName: 'Charlie',
        lastName: 'User',
        birthDate: new Date('1990-09-09'),
        role: 'USER',
        invisibleKey: 'user-key',
        isBlacklisted: false
      },
      {
        email: 'visitor@example.com',
        hash: passwordHash,
        firstName: 'Dana',
        lastName: 'Visitor',
        birthDate: new Date('1995-12-12'),
        role: 'VISITOR',
        invisibleKey: 'visitor-key',
        isBlacklisted: false
      },
      {
        email: 'employee@example.com',
        hash: passwordHash,
        firstName: 'Evan',
        lastName: 'Employee',
        birthDate: new Date('1988-03-15'),
        role: 'EMPLOYEE',
        invisibleKey: 'employee-key',
        isBlacklisted: false
      }
    ];

    const result = await prisma.user.createMany({
      data: usersData,
      skipDuplicates: true
    });

    logger.info(`✅ Auth users seeded successfully (${result.count} inserted or skipped)`);
  } catch (error) {
    logger.error('❌ Failed to seed auth users', { error: error.message });
    process.exitCode = 1;
  } finally {
    await prisma.$disconnect();
    logger.debug('[SEED][AUTH] Prisma disconnected');
  }
};
