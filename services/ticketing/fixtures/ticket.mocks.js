// Ticket mocks complet — prêt pour tests unitaires, Supertest, seed, factory, etc.

const validTicket = {
  userId: 1,
  eventId: null,         // Simule une absence d'event
  offerId: null,         // Simule une absence d'offre
  zone: 'A',
  price: 100.0,
  status: 'RESERVED'
};

const usedTicket = {
  id: 1,
  userId: 1,
  zone: 'A',
  price: 100.0,
  status: 'USED',
  eventId: null,
  offerId: null,
  createdAt: new Date(Date.now() - 3600000).toISOString(),
  updatedAt: new Date().toISOString()
};

const cancelledTicket = {
  id: 2,
  userId: 1,
  zone: 'B',
  price: 120.0,
  status: 'CANCELLED',
  eventId: null,
  offerId: null,
  createdAt: new Date(Date.now() - 7200000).toISOString(),
  updatedAt: new Date().toISOString()
};

const expiredTicket = {
  id: 3,
  userId: 2,
  zone: 'C',
  price: 80.0,
  status: 'EXPIRED',
  eventId: null,
  offerId: null,
  createdAt: new Date(Date.now() - 86400000).toISOString(),
  updatedAt: new Date().toISOString()
};

const updatedTicket = {
  id: 1,
  zone: 'B',
  price: 120.0,
  status: 'VALID'
};

const ticketListMock = [
  { id: 4, userId: 1, price: 50.0, status: 'VALID', zone: 'A', eventId: null, offerId: null },
  { id: 5, userId: 1, price: 150.0, status: 'RESERVED', zone: 'B', eventId: null, offerId: null },
  { id: 6, userId: 2, price: 75.0, status: 'CANCELLED', zone: 'C', eventId: null, offerId: null }
];

// Payload incomplet pour test de validation Zod
const invalidTicket = {
  zone: 'Z',
  price: -20,         // Prix négatif → invalide
  status: 'FLYING'    // Statut non autorisé
};

module.exports = {
  validTicket,
  usedTicket,
  cancelledTicket,
  expiredTicket,
  updatedTicket,
  ticketListMock,
  invalidTicket
};
