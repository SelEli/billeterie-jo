const request = require('supertest');

// Définir une clé JWT valide avant d'importer l'app
process.env.JWT_SECRET = 'a'.repeat(64);

beforeAll(() => {
  jest.resetModules();
});

// MOCK core.service
jest.mock('../services/core.service', () => {
  const bcrypt = require('bcryptjs');
  const hashSync = bcrypt.hashSync;
  const goodHash = hashSync('Password123!', 10);

  return {
    prisma: {
      user: {
        deleteMany: jest.fn().mockResolvedValue({}),
        findUnique: jest.fn(async ({ where }) => {
          const email = where?.email;
          if (email === 'exists@example.com') {
            return { id: 1, email: 'exists@example.com', hash: goodHash };
          }
          if (email === 'newuser@example.com') {
            return null; // libre
          }
          return null;
        }),

        create: jest.fn(async ({ data, select }) => {
          const user = {
            id: 2,
            email: data.email,
            firstName: data.firstName,
            lastName: data.lastName,
            role: 'ADMIN',
            invisibleKey: 'xxx',
            birthDate: data.birthDate || '1990-01-01',
            lastLogin: null,
            isBlacklisted: false,
            blacklistReason: null,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          };

          if (select) {
            const selectedUser = {};
            for (const key in select) {
              if (select[key] && user[key] !== undefined) {
                selectedUser[key] = user[key];
              }
            }
            return selectedUser;
          }
          return user;
        }),

        update: jest.fn().mockResolvedValue({
          id: 1,
          email: 'updated@example.com',
          firstName: 'Jane',
          lastName: 'Smith',
          role: 'VISITOR',
          invisibleKey: 'xxx',
        }),
      },
    },

    logger: { debug: jest.fn(), info: jest.fn(), warn: jest.fn(), error: jest.fn() },
    generateInvisibleKey: jest.fn(() => 'mock-key'),
    USER_SELECT: {
      id: true,
      email: true,
      firstName: true,
      lastName: true,
      birthDate: true,
      role: true,
      invisibleKey: true,
      lastLogin: true,
      isBlacklisted: true,
      blacklistReason: true,
      createdAt: true,
      updatedAt: true,
    },
    normalizeEmail: (email) => String(email || '').trim().toLowerCase(),
    toDateSafe: (d) => (d ? new Date(d) : null),
    validateId: (id) => {
      const n = Number(id);
      return Number.isInteger(n) && n > 0 ? n : null;
    },
    safePublish: jest.fn(async () => true),

    makeRead: jest.fn(() => async (id) => ({
      id,
      email: 'read@example.com',
      role: 'VISITOR',
      firstName: 'John',
      lastName: 'Doe',
      invisibleKey: 'mock-key',
    })),

    makeDelete: jest.fn(() => async (id) => ({ success: true })),

    makeList: jest.fn(() => async () => ({
      users: [{ id: 1, email: 'list@example.com' }],
      pagination: { page: 1, limit: 10, total: 1 },
    })),
  };
});

// MOCK JWT
jest.mock('jsonwebtoken', () => ({
  sign: jest.fn(() => 'mock.jwt.token'),
  verify: jest.fn(() => ({
    userId: 1,
    role: 'ADMIN', // indispensable pour passer la validation createUser
  })),
}));

const app = require('../app');

describe('✅ User Integration Tests', () => {
    test('POST /user → 201 Created', async () => {
    const payload = {
        email: 'newuser@example.com',
        password: 'Password123!',
        firstName: 'John',
        lastName: 'Doe',
        birthDate: '1990-01-01'
    };

    console.log('➡️ TEST PAYLOAD:', payload);

    const res = await request(app)
        .post('/user')
        .set('Authorization', 'Bearer mock.jwt.token')
        .send(payload);

    // 🔎 Log complet de la réponse
    console.log('⬅️ RESPONSE STATUS:', res.statusCode);
    console.log('⬅️ RESPONSE HEADERS:', res.headers);
    console.log('⬅️ RESPONSE BODY:', JSON.stringify(res.body, null, 2));

    expect(res.statusCode).toBe(201);
    expect(res.body.data.email).toBe('newuser@example.com');
    });


  test('POST /user → 400 Email already used', async () => {
    const res = await request(app)
      .post('/user')
      .set('Authorization', 'Bearer mock.jwt.token')
      .send({
        email: 'exists@example.com',
        password: 'Password123!',
      });

    expect(res.statusCode).toBe(400);
  });

  test('GET /user → 200 OK', async () => {
    const res = await request(app)
      .get('/user')
      .set('Authorization', 'Bearer mock.jwt.token');

    expect(res.statusCode).toBe(200);
    expect(res.body.data.users.length).toBeGreaterThan(0);
  });

  test('GET /user/:id → 200 OK', async () => {
    const res = await request(app)
      .get('/user/1')
      .set('Authorization', 'Bearer mock.jwt.token');

    expect(res.statusCode).toBe(200);
    expect(res.body.data.email).toBe('read@example.com');
  });

  test('PUT /user/:id → 200 OK', async () => {
    const res = await request(app)
      .put('/user/1')
      .set('Authorization', 'Bearer mock.jwt.token')
      .send({ firstName: 'Jane' });

    expect(res.statusCode).toBe(200);
    expect(res.body.data.firstName).toBe('Jane');
  });

  test('DELETE /user/:id → 204 No Content', async () => {
    const res = await request(app)
      .delete('/user/1')
      .set('Authorization', 'Bearer mock.jwt.token');

    expect(res.statusCode).toBe(204);
  });

  test('POST /user sans token → 401 Unauthorized', async () => {
    const res = await request(app).post('/user').send({
      email: 'unauth@example.com',
      password: 'Password123!',
    });
    expect(res.statusCode).toBe(401);
  });
});
