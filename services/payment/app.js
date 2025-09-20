// 📦 Charger les variables d'environnement uniquement en dev
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config({ path: '.env.development' });
}

const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const morgan = require('morgan');

const { logger, requestId, formatLogContext } = require('./utils');
const { error } = require('./utils/response');
const paymentRoutes = require('./routes/payment.routes');

// --- Config avec valeurs par défaut ---
const allowedOrigins = (process.env.CORS_ORIGINS ||
  'http://localhost:5173,http://127.0.0.1:5173,https://frontend-production-a1c6.up.railway.app'
)
  .split(',')
  .map(o => o.trim())
  .filter(Boolean);

const corsOptions = {
  origin: (origin, callback) => {
    console.log('🌍 Origin reçue:', origin);
    if (!origin) return callback(null, true); // Postman/curl
    if (allowedOrigins.length === 0) return callback(null, true);
    if (allowedOrigins.includes(origin)) return callback(null, true);
    return callback(new Error(`Not allowed by CORS: ${origin}`));
  },
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
};

const app = express();

// 🌍 Middlewares globaux
app.use(helmet());
app.use(express.json());

// CORS avant les routes
app.use(cors(corsOptions));

// Réponse aux préflights OPTIONS
app.options(/.*/, cors(corsOptions));

// 📜 Logs HTTP
app.use(
  morgan(process.env.MORGAN_FORMAT || (process.env.NODE_ENV === 'production' ? 'combined' : 'dev'))
);

// 🆔 ID unique pour chaque requête
app.use(requestId);

// 🪵 Logger compact global
app.use((req, res, next) => {
  logger.debug(`[PAYMENT-SERVICE][REQ] ${req.method} ${req.originalUrl} ${formatLogContext(req)}`);
  next();
});

// 🧹 Normalisation des URL
app.use((req, res, next) => {
  if (req.url.includes('//')) {
    req.url = req.url.replace(/\/{2,}/g, '/');
  }
  next();
});

// 💓 Healthcheck
app.get('/health', (req, res) => {
  logger.info('[PAYMENT-SERVICE][HEALTH] 💓 OK');
  res.status(200).send('OK');
});

// 🚏 Routes Payment
app.use('/payment', paymentRoutes);

// 🚫 404
app.use((req, res) => {
  logger.warn(`[PAYMENT-SERVICE][404] Route not found: ${req.method} ${req.originalUrl}`);
  res.status(404).json(error(['Route not found.']));
});

// 🛑 Gestion globale des erreurs
app.use((err, req, res, next) => {
  logger.error('[PAYMENT-SERVICE][ERROR] Unhandled error object:', err);
  logger.error('[PAYMENT-SERVICE][ERROR] Stack trace:', err && err.stack);
  if (req.body && Object.keys(req.body).length) {
    logger.error('[PAYMENT-SERVICE][ERROR] Request body at error time:', req.body);
  }
  const code = err.statusCode || 500;
  res.status(code).json(error([err.message || 'Internal server error.']));
});

module.exports = app;
