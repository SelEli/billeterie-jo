const seedAuth = require('./auth.seed');
const seedUsers = require('./users.seed');

(async () => {
  try {
    // Ordre logique : d'abord les rôles, puis les utilisateurs d'auth,
    // puis les utilisateurs métier si séparés
    await seedAuth();
    await seedUsers();

    console.log('🌱 All seeds executed successfully');
  } catch (err) {
    console.error('❌ Seed error:', err);
    process.exitCode = 1;
  } finally {
    process.exit();
  }
})();
