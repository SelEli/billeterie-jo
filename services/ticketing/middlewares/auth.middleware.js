const request = require('supertest');
const jwt = require('jsonwebtoken');
const app = require('../app');

const JWT_SECRET = process.env.JWT_SECRET || 'test_secret'; // Par défaut si pas défini

const token = jwt.sign({ userId: 'abc123' }, JWT_SECRET);

describe('🔐 Authenticated endpoints', () => {
  test('GET /ticketing/ticket with Bearer token → 200 OK', async () => {
    const res = await request(app)
      .get('/ticketing/ticket')
      .set('Authorization', `Bearer ${token}`);
      
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);  // Vérifie que la réponse est un tableau
    // Optionnel: vérifier que chaque élément a certaines propriétés, ex:
    // expect(res.body[0]).toHaveProperty('id');
  });

  test('GET /ticketing/ticket without token → 401 Unauthorized', async () => {
    const res = await request(app).get('/ticketing/ticket');
    expect(res.statusCode).toBe(401);
    expect(res.body).toHaveProperty('message');  // message d’erreur
  });
});
