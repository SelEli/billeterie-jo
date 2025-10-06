const request = require('supertest');
const app = require('../server');
const { prisma } = require('../services/core.service');
const jwt = require('jsonwebtoken');

describe('Role Integration Tests', () => {
  let adminToken;
  let userId;

  beforeAll(async () => {
    await prisma.user.deleteMany();
    const user = await prisma.user.create({
      data: {
        email: 'roleuser@example.com',
        hash: await require('bcrypt').hash('Role123!', 10),
        role: 'USER'
      }
    });
    userId = user.id;

    const admin = await prisma.user.create({
      data: {
        email: 'roleadmin@example.com',
        hash: await require('bcrypt').hash('Admin123!', 10),
        role: 'ADMIN'
      }
    });
    adminToken = jwt.sign({ userId: admin.id, role: 'ADMIN' }, process.env.JWT_SECRET, { expiresIn: '1h' });
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  test('PUT /roles/:id → met à jour le rôle', async () => {
    const res = await request(app)
      .put(`/roles/${userId}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ role: 'AGENT' });

    expect(res.statusCode).toBe(200);
    expect(res.body.data.role).toBe('AGENT');
  });

  test('GET /roles/:id → récupère le rôle', async () => {
    const res = await request(app)
      .get(`/roles/${userId}`)
      .set('Authorization', `Bearer ${adminToken}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.data.role).toBe('AGENT');
  });

  test('GET /roles → liste les rôles', async () => {
    const res = await request(app)
      .get('/roles')
      .set('Authorization', `Bearer ${adminToken}`);

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body.data)).toBe(true);
  });
});
