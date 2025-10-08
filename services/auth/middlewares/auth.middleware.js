const jwt = require('jsonwebtoken');
const { error } = require('../utils/response');
const logger = require('../utils/logger');

const authenticate = (req, res, next) => {
  const secret = process.env.JWT_SECRET;

  if (req.method === 'OPTIONS') return next();

  // 🔑 Récupération du token depuis le cookie ou l'en-tête
  const token =
    req.cookies?.access_token ||
    (req.headers.authorization?.startsWith('Bearer ')
      ? req.headers.authorization.split(' ')[1]
      : null);

  logger.info('[AUTH] Token brut reçu', {
    fromCookie: !!req.cookies?.access_token,
    fromHeader: !!req.headers.authorization,
    tokenSnippet: token ? token.substring(0, 20) + '...' : null
  });

  if (!token) {
    logger.warn('[AUTH] Aucun token trouvé');
    return res.status(401).json(error(['TOKEN_MISSING_OR_MALFORMED'], 401));
  }

  if (!secret) {
    logger.error('[AUTH] JWT_SECRET non défini');
    return res.status(500).json(error(['JWT_SECRET_NOT_DEFINED'], 500));
  }

  try {
    const decoded = jwt.verify(token, secret);
    const userIdNum = Number(decoded.userId);

    logger.info('[AUTH] Token décodé', { decoded });

    if (!Number.isInteger(userIdNum) || userIdNum <= 0) {
      logger.warn('[AUTH] userId invalide dans le token', { userId: decoded.userId });
      return res.status(401).json(error(['USER_ID_INVALID'], 401));
    }

    // 🔹 Enrichissement req.user avec token + cookie
    req.user = {
      ...decoded,
      userId: userIdNum,
      token,
      cookie: req.headers.cookie || null
    };

    logger.info('[AUTH] req.user enrichi', req.user);
    next();
  } catch (err) {
    logger.error('[AUTH] Erreur vérification JWT', { message: err.message, stack: err.stack });
    return res.status(401).json(error(['TOKEN_INVALID'], 401));
  }
};

module.exports = authenticate;
