const seedTickets = require('./tickets.seed.js');
const seedUsers = require('./users.seed.js');
const seedEvents = require('./events.seed.js');
const seedOffers = require('./offers.seed.js');

(async () => {
  await seedUsers();
  await seedEvents();
  await seedOffers();
  await seedTickets();
})();
