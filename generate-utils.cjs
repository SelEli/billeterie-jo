const fs = require('fs');
const path = require('path');

const services = [
  'auth',
  'paiement',
  'ticketing',
  'verification',
  'gateway'
];

const utils = {
  'clefs.js': `
const crypto = require('crypto');

function genererClef() {
  return crypto.randomBytes(16).toString('hex');
}

function combinerClefs(clefUtilisateur, clefAchat) {
  const secret = process.env.CLEF_SIGNATURE_SECRET || 'secret-signature';
  return crypto
    .createHmac('sha256', secret)
    .update(clefUtilisateur + clefAchat)
    .digest('hex');
}

function verifierClefs(clefCombinee, clefUtilisateur, clefAchat) {
  return combinerClefs(clefUtilisateur, clefAchat) === clefCombinee;
}

module.exports = { genererClef, combinerClefs, verifierClefs };
  `,

  'logger.js': `
const winston = require('winston');

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  defaultMeta: { service: process.env.SERVICE_NAME || 'service-unknown' },
  transports: [new winston.transports.Console()]
});

module.exports = logger;
  `,

  'redisClient.js': `
const redis = require('redis');
const client = redis.createClient({ url: process.env.REDIS_URL || 'redis://redis:6379' });

client.on('error', err => console.error('Redis error:', err));
client.connect();

module.exports = client;
  `,

  'jwt.js': `
const jwt = require('jsonwebtoken');

function genererToken(payload) {
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1d' });
}

function verifierToken(token) {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    return null;
  }
}

module.exports = { genererToken, verifierToken };
  `,

  'requestId.js': `
const { v4: uuidv4 } = require('uuid');

function assignRequestId(req, res, next) {
  req.requestId = uuidv4();
  next();
}

module.exports = assignRequestId;
  `
};

for (const service of services) {
  const utilsPath = path.join(__dirname, 'services', service, 'utils');
  fs.mkdirSync(utilsPath, { recursive: true });

  for (const [filename, content] of Object.entries(utils)) {
    const filePath = path.join(utilsPath, filename);
    fs.writeFileSync(filePath, content.trim());
    console.log('✅ Créé: ' + filePath);
  }
}

console.log('\n🎉 Tous les fichiers utils ont été générés dans chaque microservice.');
