// 📦 Charger les variables d'environnement uniquement en dev
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config({ path: '.env.development' });
}

const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const morgan = require('morgan');
const cookieParser = require('cookie-parser'); // 👈 ajout

const { logger, requestId, formatLogContext } = require('./utils');
const { error } = require('./utils/response');
const mainRoutes = require('./routes');

// --- Config avec valeurs par défaut ---
// On ajoute Railway + localhost par défaut si CORS_ORIGINS n'est pas défini
const CORS_ORIGINS = (process.env.CORS_ORIGINS ||
  'http://localhost:5173,https://frontend-production-a1c6.up.railway.app'
)
  .split(',')
  .map(o => o.trim())
  .filter(Boolean);

const app = express();

// 🌍 Middlewares globaux
app.use(helmet());
app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true); // Postman, curl
    if (CORS_ORIGINS.length === 0) return callback(null, true);
    if (CORS_ORIGINS.includes(origin)) return callback(null, true);
    return callback(new Error(`Not allowed by CORS: ${origin}`));
  },
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

app.use(express.json());
app.use(cookieParser()); // 👈 indispensable pour lire les cookies httpOnly

app.use(
  morgan(process.env.MORGAN_FORMAT || (process.env.NODE_ENV === 'production' ? 'combined' : 'dev'))
);

// 🆔 ID unique pour chaque requête
app.use(requestId);

// 🪵 Logger compact global
app.use((req, res, next) => {
  logger.debug(`[APP][REQ] ${formatLogContext(req)}`);
  next();
});

// 🚏 Montage des routes agrégées
app.use('/', mainRoutes);

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

// 🔒 Log de sécurité unique après initialisation
logger.info(`✅ Application initialisée avec ${CORS_ORIGINS.length} origine(s) CORS autorisée(s)`);

module.exports = app;
