const prisma = require('../utils/prismaClient');

module.exports = async function seedTickets() {
  await prisma.ticket.createMany({
    data: [
      {
        userId: 1,
        eventId: 999,
        offerId: 101,
        zone: 'A',
        price: 70.0,
        status: 'RESERVED'
      },
      {
        userId: 2,
        eventId: 1000,
        offerId: null,
        zone: 'B',
        price: 120.0,
        status: 'VALID'
      },
      {
        userId: 1,
        eventId: null,
        offerId: 102,
        zone: 'C',
        price: 0.0,
        status: 'VALID'
      }
    ],
    skipDuplicates: true
  });

  console.log('✅ Tickets seeded');
};
