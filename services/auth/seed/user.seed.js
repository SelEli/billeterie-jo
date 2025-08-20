// prisma/seed.js (service Auth)
const bcrypt = require('bcrypt');

/**
 * Génère des seeds de comptes utilisateurs pour Auth
 * @param {import('@prisma/client').PrismaClient} prisma
 */
async function main(prisma) {
  const passwordHash = await bcrypt.hash('Password123!', 10);

  await prisma.user.createMany({
    data: [
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
    ]
  });

  console.log('✅ Seed utilisateurs Auth inséré avec succès');
}

module.exports = main;
