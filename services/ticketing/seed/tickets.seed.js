const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

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
        eventId: null,
        offerId: null,
        zone: 'C',
        price: 120.0,
        status: 'VALID'
      }
    ],
    skipDuplicates: true
  });

  console.log('✅ Tickets seeded');
};
