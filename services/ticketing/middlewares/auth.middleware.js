const jwt = require('jsonwebtoken');
const { logger, sendBusinessError } = require('../utils');

const authenticate = (req, res, next) => {
  const secret = process.env.JWT_SECRET;

  if (req.method === 'OPTIONS') return next();

  const token =
    req.cookies?.access_token ||
    (req.headers.authorization?.startsWith('Bearer ')
      ? req.headers.authorization.split(' ')[1]
      : null);

  logger.debug('[AUTH] Vérification du token reçu', {
    method: req.method,
    url: req.originalUrl,
    hasCookie: !!req.cookies?.access_token,
    hasAuthHeader: !!req.headers.authorization,
    tokenSnippet: token ? token.substring(0, 20) + '...' : null
  });

  if (!token) {
    logger.warn('[AUTH] Aucun token trouvé dans la requête');
    return sendBusinessError(res, 'TOKEN_MISSING_OR_MALFORMED');
  }

  if (!secret) {
    logger.error('[AUTH] JWT_SECRET non défini dans les variables d’environnement');
    return sendBusinessError(res, 'JWT_SECRET_NOT_DEFINED');
  }

  try {
    const decoded = jwt.verify(token, secret);
    const userIdNum = Number(decoded.userId);

    if (!Number.isInteger(userIdNum) || userIdNum <= 0) {
      logger.warn('[AUTH] userId invalide dans le token', { decoded });
      return sendBusinessError(res, 'USER_ID_INVALID');
    }

    req.user = {
      ...decoded,
      userId: userIdNum,
      token,
      cookie: req.headers.cookie || null
    };

    logger.info('[AUTH] Authentification réussie', {
      userId: req.user.userId,
      role: req.user.role,
      tokenSnippet: req.user.token.substring(0, 20) + '...',
      cookieSnippet: req.user.cookie
        ? req.user.cookie.substring(0, 50) + '...'
        : null
    });

    next();
  } catch (err) {
    logger.error('[AUTH] Erreur lors de la vérification JWT', {
      error: err.message,
      stack: err.stack?.split('\n')[0]
    });

    if (err.name === 'TokenExpiredError') {
      return sendBusinessError(res, 'TOKEN_EXPIRED');
    }

    return sendBusinessError(res, 'TOKEN_INVALID');
  }
};

module.exports = authenticate;
