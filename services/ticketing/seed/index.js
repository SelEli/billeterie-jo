const seedUsers = require('./users.seed');
const seedEvents = require('./events.seed');
const seedOffers = require('./offers.seed');
const seedTickets = require('./tickets.seed');

(async () => {
  try {
    await seedUsers();
    await seedEvents();
    await seedOffers();
    await seedTickets();
    console.log('🌱 All seeds executed');
  } catch (err) {
    console.error('❌ Seed error:', err);
  } finally {
    process.exit();
  }
})();
