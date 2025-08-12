// __mocks__/utils/prismaClient.js

let tickets = [];

const ticket = {
  create: jest.fn(({ data }) => {
    const newTicket = { id: tickets.length + 1, ...data };
    tickets.push(newTicket);
    return Promise.resolve(newTicket);
  }),

  findUnique: jest.fn(({ where }) => {
    const found = tickets.find(t => t.id === where.id);
    return Promise.resolve(found || null);
  }),

  findMany: jest.fn(({ where } = {}) => {
    // si where vide ou absent, on retourne tout
    const filter = where || {};
    const results = tickets.filter(t =>
      Object.entries(filter).every(([key, val]) => t[key] === val)
    );
    return Promise.resolve(results);
  }),

  update: jest.fn(({ where, data }) => {
    const idx = tickets.findIndex(t => t.id === where.id);
    if (idx === -1) {
      return Promise.resolve(null);
    }
    tickets[idx] = { ...tickets[idx], ...data };
    return Promise.resolve(tickets[idx]);
  }),

  delete: jest.fn(({ where }) => {
    const idx = tickets.findIndex(t => t.id === where.id);
    if (idx === -1) {
      return Promise.resolve(null);
    }
    const [deleted] = tickets.splice(idx, 1);
    return Promise.resolve(deleted);
  })
};

module.exports = {
  ticket,

  // Vide la base mock et reset les compteurs d'appels sur chaque fn
  __reset: () => {
    tickets = [];
    ticket.create.mockClear();
    ticket.findUnique.mockClear();
    ticket.findMany.mockClear();
    ticket.update.mockClear();
    ticket.delete.mockClear();
  },

  // Pour inspecter ce qui a été créé dans les tests
  __getAll: () => [...tickets]
};
