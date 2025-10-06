const request = require('supertest');

// Définir une clé JWT valide avant d'importer l'app
process.env.JWT_SECRET = 'a'.repeat(64);

// MOCK core.service
jest.mock('../services/core.service', () => {
  const bcrypt = require('bcryptjs');
  const hashSync = bcrypt.hashSync;

  const goodHash = hashSync('Password123!', 10);
  const badHash = hashSync('WrongPass!', 10);

  return {
    prisma: {
      user: {
        deleteMany: jest.fn().mockResolvedValue({}),
        findUnique: jest.fn(async ({ where }) => {
          const email = where?.email;

          if (email === 'newuser@example.com') {
            return null; // Utilisateur non trouvé
          }

          if (email === 'test@example.com') {
            return {
              id: 1,
              email: 'test@example.com',
              hash: goodHash,
              role: 'VISITOR',
              firstName: 'John',
              lastName: 'Doe',
              invisibleKey: 'xxx',
            }; // login success
          }

          if (email === 'test-wrongpass@example.com') {
            return {
              id: 1,
              email: 'test@example.com',
              hash: badHash,
              role: 'VISITOR',
              firstName: 'John',
              lastName: 'Doe',
              invisibleKey: 'xxx',
            }; // login wrong password
          }

          return null; // Non trouvé
        }),

        create: jest.fn(async ({ data, select }) => {
          const user = {
            id: 2,
            email: data.email,
            firstName: data.firstName,
            lastName: data.lastName,
            role: 'VISITOR',
            invisibleKey: 'xxx',
            birthDate: data.birthDate || '1990-01-01',
            lastLogin: null,
            isBlacklisted: false,
            blacklistReason: null,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            token: 'mock.jwt.token',
          };

          // Appliquer le "select" si présent
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
          email: 'test@example.com',
          firstName: 'Jane',
          lastName: 'Smith',
          role: 'VISITOR',
          invisibleKey: 'xxx',
        }),
      },
    },

    logger: {
      debug: jest.fn(),
      info: jest.fn(),
      warn: jest.fn(),
      error: jest.fn(),
    },

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
      email: 'test@example.com',
      role: 'VISITOR',
      firstName: 'John',
      lastName: 'Doe',
      invisibleKey: 'mock-key',
    })),

    makeDelete: jest.fn(() => async (id) => ({ success: true })),

    makeList: jest.fn(() => async () => ({
      users: [],
      pagination: { page: 1, limit: 10, total: 0 },
    })),
  };
});

// MOCK redisClient
jest.mock('../utils/redisClient', () => ({
  initRedis: jest.fn(() => true),
  getRedis: jest.fn(() => ({
    get: jest.fn(),
    set: jest.fn(),
    del: jest.fn(),
  })),
}));

// MOCK kafkaClient
jest.mock('../utils/kafkaClient', () => ({
  initKafka: jest.fn(() => true),
  getKafka: jest.fn(() => ({
    producer: jest.fn(() => ({
      connect: jest.fn(),
      send: jest.fn(),
      disconnect: jest.fn(),
    })),
  })),
  publishKafkaEvent: jest.fn(async () => true),
}));

// MOCK JWT (synchrone, car ton middleware utilise jwt.verify(token, secret))
jest.mock('jsonwebtoken', () => ({
  sign: jest.fn(() => 'mock.jwt.token'),
  verify: jest.fn((token, secret) => {
    if (token === 'mock.jwt.token') {
      return {
        userId: 1,
        firstName: 'John',
        lastName: 'Doe',
        role: 'VISITOR',
        iat: 1000,
        exp: 9999999999,
      };
    }
    throw new Error('Invalid token');
  }),
}));

// Import app
const app = require('../app');

describe('✅ Auth Integration Tests', () => {
  test('POST /auth/register → 201 Created', async () => {
    const res = await request(app).post('/auth/register').send({
      email: 'newuser@example.com',
      password: 'Password123!@#', // Mot de passe valide selon ta règle
      firstName: 'John',
      lastName: 'Doe',
      birthDate: '1990-01-01',
    });

    console.log('REGISTER RESPONSE:', res.body); // Debug utile

    // ✅ Vérifie le statut
    expect(res.statusCode).toBe(201);

    // ✅ Vérifie que data et email sont présents
    expect(res.body).toHaveProperty('data');
    expect(res.body.data).toHaveProperty('email');
    expect(res.body.data.email).toBe('newuser@example.com');
  });



  test('POST /auth/login → 400 Wrong password', async () => {
    const res = await request(app).post('/auth/login').send({
      email: 'test-wrongpass@example.com',
      password: 'WrongPass!',
    });

    expect(res.statusCode).toBe(400);
    // Vérifie que le message d'erreur contient le mot "mot de passe"
    expect(res.body.errors.some(e => e.toLowerCase().includes('mot de passe'))).toBe(true);
  });

  test('POST /auth/login → 400 Missing credentials', async () => {
    const res = await request(app).post('/auth/login').send({
      email: '',
      password: '',
    });

    expect(res.statusCode).toBe(400);
    // Vérifie que l'erreur concerne l'email ou le mot de passe manquants
    expect(
      res.body.errors.some(
        (e) =>
          e.toLowerCase().includes('email') ||
          e.toLowerCase().includes('mot de passe')
      )
    ).toBe(true);
  });

  test('GET /auth/profile → 200 OK', async () => {
    const login = await request(app).post('/auth/login').send({
      email: 'test@example.com',
      password: 'Password123!',
    });

    expect(login.statusCode).toBe(200);
    const token = login.body.data.token;

    const res = await request(app)
      .get('/auth/profile')
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.data.email).toBe('test@example.com');
  });

  test('PUT /auth/profile → 200 OK', async () => {
    const login = await request(app).post('/auth/login').send({
      email: 'test@example.com',
      password: 'Password123!',
    });

    expect(login.statusCode).toBe(200);
    const token = login.body.data.token;

    const res = await request(app)
      .put('/auth/profile')
      .set('Authorization', `Bearer ${token}`)
      .send({
        firstName: 'Jane',
        lastName: 'Smith',
      });

    expect(res.statusCode).toBe(200);
    expect(res.body.data.firstName).toBe('Jane');
  });

  test('DELETE /auth/profile → 204 No Content', async () => {
    const login = await request(app).post('/auth/login').send({
      email: 'test@example.com',
      password: 'Password123!',
    });

    expect(login.statusCode).toBe(200);
    const token = login.body.data.token;

    const res = await request(app)
      .delete('/auth/profile')
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(204);
  });

  test('POST /auth/logout → 200 OK', async () => {
    const login = await request(app).post('/auth/login').send({
      email: 'test@example.com',
      password: 'Password123!',
    });

    expect(login.statusCode).toBe(200);
    const token = login.body.data.token;

    const res = await request(app)
      .post('/auth/logout')
      .set('Authorization', `Bearer ${token}`)
      .send({}); // logoutSchema valide

    expect(res.statusCode).toBe(200);
    expect(res.body.data.message).toBe('Logged out successfully');
  });

  test('GET /auth/profile sans token → 401 Unauthorized', async () => {
    const res = await request(app).get('/auth/profile');
    expect(res.statusCode).toBe(401);
  });
});
