const jwt = require('jsonwebtoken');
const { error } = require('../utils/response');
const logger = require('../utils/logger'); // ⚠️ ajoute ton logger

const authenticate = (req, res, next) => {
  const secret = process.env.JWT_SECRET;
  if (req.method === 'OPTIONS') return next();

  // 🔑 Récupération du token depuis le cookie ou l'en-tête
  const token =
    req.cookies?.access_token ||
    (req.headers.authorization?.startsWith('Bearer ')
      ? req.headers.authorization.split(' ')[1]
      : null);

  // 🔎 Log complet pour debug
  logger.info('[AUTH] Vérification des infos reçues', {
    rawCookieHeader: req.headers.cookie || null,
    parsedCookies: req.cookies || null,
    authorizationHeader: req.headers.authorization || null,
    extractedToken: token ? token.substring(0, 20) + '...' : null
  });

  if (!token) {
    return res.status(401).json(error(['TOKEN_MISSING_OR_MALFORMED'], 401));
  }

  if (!secret) {
    return res.status(500).json(error(['JWT_SECRET_NOT_DEFINED'], 500));
  }

  try {
    const decoded = jwt.verify(token, secret);
    const userIdNum = Number(decoded.userId);

    if (!Number.isInteger(userIdNum) || userIdNum <= 0) {
      return res.status(401).json(error(['USER_ID_INVALID'], 401));
    }

    // 🔹 On enrichit req.user avec le token et le cookie brut
    req.user = {
      ...decoded,
      userId: userIdNum,
      token,
      cookie: req.headers.cookie || null
    };

    logger.info('[AUTH] req.user enrichi', {
      userId: req.user.userId,
      tokenSnippet: req.user.token.substring(0, 20) + '...',
      cookieSnippet: req.user.cookie
        ? req.user.cookie.substring(0, 50) + '...'
        : null
    });

    next();
  } catch (err) {
    return res.status(401).json(error(['TOKEN_INVALID'], 401));
  }
};

module.exports = authenticate;
