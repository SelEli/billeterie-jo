const express = require('express');
const jwt = require('jsonwebtoken');
const request = require('supertest');

const SECRET = 'maCleTresSecreteEtComplexe12345!';

const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Token manquant ou mal formé' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, SECRET);
    req.user = { userId: decoded.userId };
    next();
  } catch {
    return res.status(401).json({ error: 'Token invalide' });
  }
};

const app = express();

app.get('/test', authenticate, (req, res) => {
  res.json({ userId: req.user.userId });
});

(async () => {
  const token = jwt.sign({ userId: 42 }, SECRET, { expiresIn: '1h' });

  const response = await request(app)
    .get('/test')
    .set('Authorization', `Bearer ${token}`);

  console.log('Status:', response.status);
  console.log('Body:', response.body);

  if (response.status === 200 && response.body.userId === 42) {
    console.log('✅ Middleware fonctionne correctement avec le token codé en dur');
  } else {
    console.log('❌ Middleware échoue, regarde les logs');
  }
})();
