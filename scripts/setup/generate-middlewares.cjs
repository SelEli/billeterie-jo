const fs = require('fs');
const path = require('path');

const services = [
  'auth',
  'paiement',
  'ticketing',
  'verification',
  'gateway'
];

const middlewares = {
  'validateBody.js': `
const { ZodError } = require('zod');

function validateBody(schema) {
  return (req, res, next) => {
    try {
      req.body = schema.parse(req.body);
      next();
    } catch (err) {
      if (err instanceof ZodError) {
        return res.status(400).json({ error: err.errors });
      }
      next(err);
    }
  };
}

module.exports = validateBody;
  `,

  'auth.js': `
const { verifierToken } = require('../utils/jwt');

function authMiddleware(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Token manquant' });

  const decoded = verifierToken(token);
  if (!decoded) return res.status(403).json({ error: 'Token invalide ou expiré' });

  req.user = decoded;
  next();
}

module.exports = authMiddleware;
  `
};

for (const service of services) {
  const mwPath = path.join(__dirname, 'services', service, 'middlewares');
  fs.mkdirSync(mwPath, { recursive: true });

  for (const [filename, content] of Object.entries(middlewares)) {
    const filePath = path.join(mwPath, filename);
    fs.writeFileSync(filePath, content.trim());
    console.log('✅ Créé: ' + filePath);
  }
}

console.log('\n🎉 Tous les middlewares ont été générés dans chaque microservice.');
