// 📦 Charger les variables d'environnement uniquement en dev
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config({ path: '.env.development' });
}

const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const morgan = require('morgan');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser'); // 👈 ajout

const { logger, requestId, formatLogContext } = require('./utils');
const { error } = require('./utils/response');
const mainRoutes = require('./routes'); // <-- index des routes

// --- Config avec valeurs par défaut ---
// On inclut Railway + localhost par défaut si CORS_ORIGINS n'est pas défini
const allowedOrigins = (process.env.CORS_ORIGINS ||
  'http://localhost:5173,https://frontend-production-a1c6.up.railway.app'
)
  .split(',')
  .map(o => o.trim())
  .filter(Boolean);

const corsOptions = {
  origin: (origin, callback) => {
    console.log('🌍 Origin reçue:', origin); // log pour debug
    if (!origin) return callback(null, true); // Postman/curl
    if (allowedOrigins.length === 0) return callback(null, true);
    if (allowedOrigins.includes(origin)) return callback(null, true);
    return callback(new Error(`Not allowed by CORS: ${origin}`));
  },
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true // autorise cookies / Authorization
};

const app = express();

// 🌍 Middlewares globaux
app.use(helmet());

// CORS doit être placé avant les routes
app.use(cors(corsOptions));

// Réponse aux préflights OPTIONS
app.options('*', cors(corsOptions));

app.use(express.json());
app.use(cookieParser()); // 👈 indispensable pour lire les cookies httpOnly

app.use(
  morgan(
    process.env.MORGAN_FORMAT ||
      (process.env.NODE_ENV === 'production' ? 'combined' : 'dev')
  )
);

// 🆔 ID unique pour chaque requête
app.use(requestId);

// 🪵 Logger compact global
app.use((req, res, next) => {
  logger.debug(`[APP][REQ] ${formatLogContext(req)}`);
  next();
});

// 🔎 Logger global pour traquer toutes les requêtes entrantes + décoder JWT
app.use((req, res, next) => {
  const auth = req.headers['authorization'];
  let decoded = null;

  if (auth && auth.startsWith('Bearer ')) {
    try {
      const token = auth.split(' ')[1];
      decoded = jwt.decode(token); // decode sans vérification de signature
    } catch (e) {
      decoded = { error: 'JWT decode failed', message: e.message };
    }
  }

  console.log('>>> [GLOBAL INCOMING REQUEST]', {
    method: req.method,
    url: req.originalUrl,
    ip: req.ip,
    userAgent: req.headers['user-agent'],
    body: req.body,
    jwt: decoded
  });

  next();
});

// 🚫 Hack anti-GET parasite sur /ticket/verify
app.use((req, res, next) => {
  if (req.path === '/ticket/verify' && req.method === 'GET') {
    console.warn('⚠️ GET parasite intercepté → transformé en POST');
    req.method = 'POST';

    // Si jamais le ticketId est passé en query, on le mappe dans le body
    if (req.query.ticketId && !req.body.ticketId) {
      req.body.ticketId = req.query.ticketId;
    }
  }
  next();
});

// 🚏 Montage des routes via index
app.use('/', mainRoutes);

// 💓 Healthcheck
app.get('/health', (req, res) => {
  logger.info('[HEALTH] 💓 OK');
  res.status(200).send('OK');
});

// 🚫 404 — non trouvé
app.use((req, res) => {
  logger.warn(`[APP][404] Route not found: ${req.method} ${req.originalUrl}`);
  res.status(404).json(error(['Route not found.']));
});

// 🛑 Gestion globale des erreurs
app.use((err, req, res, next) => {
  logger.error('[APP][ERROR] Unhandled error object:', err);
  logger.error('[APP][ERROR] Stack trace:', err && err.stack);
  if (req.body && Object.keys(req.body).length) {
    logger.error('[APP][ERROR] Request body at error time:', req.body);
  }
  const code = err.statusCode || 500;
  res.status(code).json(error([err.message || 'Internal server error.']));
});

module.exports = app;
