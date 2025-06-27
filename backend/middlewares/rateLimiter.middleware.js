const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 20, // max 20 requêtes par IP
  message: 'Trop de requêtes, réessaie plus tard.',
  standardHeaders: true,
  legacyHeaders: false
});

module.exports = limiter;
