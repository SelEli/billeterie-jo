const jwt = require('jsonwebtoken');
const { error } = require('../utils/response');

const authenticate = (req, res, next) => {
  const secret = process.env.JWT_SECRET;
  if (req.method === 'OPTIONS') return next();

  // 🔑 Récupération du token depuis le cookie ou l'en-tête
  const token =
    req.cookies?.access_token ||
    (req.headers.authorization?.startsWith('Bearer ')
      ? req.headers.authorization.split(' ')[1]
      : null);

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

    req.user = { ...decoded, userId: userIdNum };
    next();
  } catch (err) {
    return res.status(401).json(error(['TOKEN_INVALID'], 401));
  }
};

module.exports = authenticate;
