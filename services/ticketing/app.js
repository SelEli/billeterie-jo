if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config({ path: '.env.development' });
}

const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const morgan = require('morgan');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');

const { logger, requestId, formatLogContext } = require('./utils');
const { error } = require('./utils/response');
const mainRoutes = require('./routes');

// --- Config avec valeurs par défaut ---
const allowedOrigins = (process.env.CORS_ORIGINS ||
  'http://localhost:5173,https://frontend-production-a1c6.up.railway.app'
)
  .split(',')
  .map(o => o.trim())
  .filter(Boolean);

const corsOptions = {
  origin: (origin, callback) => {
    logger.debug('🌍 Origin reçue', { origin });
    if (!origin) return callback(null, true);
    if (allowedOrigins.length === 0) return callback(null, true);
    if (allowedOrigins.includes(origin)) return callback(null, true);
    return callback(new Error(`Not allowed by CORS: ${origin}`));
  },
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Cookie'],
  exposedHeaders: ['Set-Cookie'],
  credentials: true
};

const app = express();

app.use(helmet());
app.use(cors(corsOptions));
app.options('*', cors(corsOptions));

app.use(express.json());

// 🔎 Capture spécifique des erreurs du body parser
app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && 'body' in err) {
    const fields = {
      message: err.message,
      stack: err.stack,
      headers: req.headers,
      rawBody: req.body
    };
    for (const [key, value] of Object.entries(fields)) {
      logger.error(`[APP][BODY PARSER ERROR] ${key}:`, value);
    }
    return res.status(400).json(error(['INVALID_JSON']));
  }
  next(err);
});

app.use(cookieParser());
app.use(
  morgan(
    process.env.MORGAN_FORMAT ||
      (process.env.NODE_ENV === 'production' ? 'combined' : 'dev')
  )
);

app.use(requestId);

// 🪵 Logger compact global
app.use((req, res, next) => {
  const reqInfo = {
    method: req.method,
    url: req.originalUrl,
    ip: req.ip,
    headers: req.headers,
    body: req.body
  };
  for (const [key, value] of Object.entries(reqInfo)) {
    logger.info(`[APP][REQ] ${key}:`, value);
  }
  next();
});

// 🔎 Logger global pour traquer toutes les requêtes entrantes + décoder JWT
app.use((req, res, next) => {
  const auth = req.headers['authorization'];
  let decoded = null;

  if (auth && auth.startsWith('Bearer ')) {
    try {
      const token = auth.split(' ')[1];
      decoded = jwt.decode(token);
    } catch (e) {
      decoded = { error: 'JWT decode failed', message: e.message };
    }
  }

  const globalInfo = {
    method: req.method,
    url: req.originalUrl,
    ip: req.ip,
    userAgent: req.headers['user-agent'],
    body: req.body,
    jwt: decoded,
    cookieHeader: req.headers.cookie || null
  };
  for (const [key, value] of Object.entries(globalInfo)) {
    logger.debug(`>>> [GLOBAL INCOMING REQUEST] ${key}:`, value);
  }

  next();
});

// 🚫 Hack anti-GET parasite sur /ticket/verify
app.use((req, res, next) => {
  if (req.path === '/ticket/verify' && req.method === 'GET') {
    logger.warn('⚠️ GET parasite intercepté → transformé en POST');
    req.method = 'POST';
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
  logger.warn('[APP][404] Route not found', {
    method: req.method,
    url: req.originalUrl
  });
  res.status(404).json(error(['Route not found.']));
});

// 🛑 Gestion globale des erreurs
app.use((err, req, res, next) => {
  const fields = {
    name: err.name,
    message: err.message,
    stack: err.stack,
    statusCode: err.statusCode,
    headers: req.headers,
    body: req.body
  };
  for (const [key, value] of Object.entries(fields)) {
    logger.error(`[APP][ERROR] ${key}:`, value);
  }
  const code = err.statusCode || 500;
  res.status(code).json(error([err.message || 'Internal server error.']));
});

module.exports = app;
