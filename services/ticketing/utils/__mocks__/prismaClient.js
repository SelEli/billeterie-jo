// __mocks__/utils/prismaClient.js

let tickets = [];
let events = [];
let offers = [];

// Fabrique générique pour un modèle CRUD mémoire
function makeMockModel(getStore) {
  return {
    create: jest.fn(({ data }) => {
      const store = getStore();
      const newItem = { id: store.length + 1, ...data };
      store.push(newItem);
      return Promise.resolve(newItem);
    }),

    findUnique: jest.fn(({ where }) => {
      const store = getStore();
      const key = Object.keys(where)[0];
      const val = where[key];
      const found = store.find(i => i[key] === val);
      return Promise.resolve(found || null);
    }),

    findMany: jest.fn(({ where } = {}) => {
      const store = getStore();
      if (!where) return Promise.resolve([...store]);
      const results = store.filter(item =>
        Object.entries(where).every(([k, v]) => {
          // Support simple nested filter for date range and null checks if needed in tests
          if (typeof v === 'object' && v !== null) return true; // no-op for complex where in mock
          return item[k] === v;
        })
      );
      return Promise.resolve(results);
    }),

    update: jest.fn(({ where, data }) => {
      const store = getStore();
      const key = Object.keys(where)[0];
      const val = where[key];
      const idx = store.findIndex(i => i[key] === val);
      if (idx === -1) return Promise.resolve(null);
      store[idx] = { ...store[idx], ...data };
      return Promise.resolve(store[idx]);
    }),

    delete: jest.fn(({ where }) => {
      const store = getStore();
      const key = Object.keys(where)[0];
      const val = where[key];
      const idx = store.findIndex(i => i[key] === val);
      if (idx === -1) return Promise.resolve(null);
      const [deleted] = store.splice(idx, 1);
      return Promise.resolve(deleted);
    })
  };
}

const ticket = makeMockModel(() => tickets);
const event = makeMockModel(() => events);
const offer = makeMockModel(() => offers);

module.exports = {
  ticket,
  event,
  offer,

  __reset: () => {
    tickets = [];
    events = [];
    offers = [];

    ticket.create.mockClear();
    ticket.findUnique.mockClear();
    ticket.findMany.mockClear();
    ticket.update.mockClear();
    ticket.delete.mockClear();

    event.create.mockClear();
    event.findUnique.mockClear();
    event.findMany.mockClear();
    event.update.mockClear();
    event.delete.mockClear();

    offer.create.mockClear();
    offer.findUnique.mockClear();
    offer.findMany.mockClear();
    offer.update.mockClear();
    offer.delete.mockClear();
  },

  __getAllTickets: () => [...tickets],
  __getAllEvents: () => [...events],
  __getAllOffers: () => [...offers]
};
