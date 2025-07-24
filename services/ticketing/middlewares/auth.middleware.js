// tests/auth.integration.test.js
const request = require('supertest');
const jwt = require('jsonwebtoken');
const app = require('../app');

const token = jwt.sign({ userId: 'abc123' }, process.env.JWT_SECRET);

describe('🔐 Authenticated endpoints', () => {
  test('GET /ticketing/ticket with Bearer token → 200 OK', async () => {
    const res = await request(app)
      .get('/ticketing/ticket')
      .set('Authorization', `Bearer ${token}`);
      
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('message', 'Tickets listed');
  });

  test('GET /ticketing/ticket without token → 401', async () => {
    const res = await request(app).get('/ticketing/ticket');
    expect(res.statusCode).toBe(401);
    expect(res.body).toHaveProperty('message');
  });
});
