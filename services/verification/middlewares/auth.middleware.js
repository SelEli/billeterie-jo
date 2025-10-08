// middlewares/auth.middleware.js
const jwt = require('jsonwebtoken');

const authenticate = (req, res, next) => {
  const secret = process.env.JWT_SECRET;

  // Ignore pre-flight
  if (req.method === 'OPTIONS') return next();

  // 🔑 Récupération du token : cookie d'abord, puis header Authorization
  const token =
    req.cookies?.access_token ||
    (req.headers.authorization?.startsWith('Bearer ')
      ? req.headers.authorization.split(' ')[1]
      : null);

  if (!token) {
    return res.status(401).json({
      status: 'error',
      data: null,
      errors: ['Token manquant ou mal formé'],
      meta: {}
    });
  }

  if (!secret) {
    return res.status(500).json({
      status: 'error',
      data: null,
      errors: ['JWT_SECRET non défini'],
      meta: {}
    });
  }

  try {
    const decoded = jwt.verify(token, secret);
    const userIdNum = Number(decoded.userId);

    if (!Number.isInteger(userIdNum) || userIdNum <= 0) {
      return res.status(401).json({
        status: 'error',
        data: null,
        errors: ['userId invalide'],
        meta: {}
      });
    }

    req.user = { ...decoded, userId: userIdNum };
    next();
  } catch (err) {
    return res.status(401).json({
      status: 'error',
      data: null,
      errors: ['Token invalide'],
      meta: {}
    });
  }
};

module.exports = authenticate;
