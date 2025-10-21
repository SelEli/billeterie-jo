// __mocks__/utils/prismaClient.js

let users = [];

// Fabrique générique CRUD mémoire
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
      return Promise.resolve(store.find(i => i[key] === val) || null);
    }),

    findMany: jest.fn(({ where } = {}) => {
      const store = getStore();
      if (!where) return Promise.resolve([...store]);
      const results = store.filter(item =>
        Object.entries(where).every(([k, v]) => item[k] === v)
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
    }),

    deleteMany: jest.fn(() => {
      const store = getStore();
      const count = store.length;
      store.length = 0;
      return Promise.resolve({ count });
    })
  };
}

const user = makeMockModel(() => users);

module.exports = {
  user,

  __reset: () => {
    users = [];
    Object.values(user).forEach(fn => fn.mockClear && fn.mockClear());
  },

  __getAllUsers: () => [...users]
};
