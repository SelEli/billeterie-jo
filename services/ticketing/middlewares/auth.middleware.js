// middlewares/auth.middleware.js
const jwt = require('jsonwebtoken');

const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;
  const secret = process.env.JWT_SECRET;

  // Log compact entrée requête
  console.log(`[AUTH] ${req.method} ${req.originalUrl} | Authorization: ${authHeader || '∅'} | JWT_SECRET: ${!!secret}`);

  // Ignore pre-flight
  if (req.method === 'OPTIONS') return next();

  if (!authHeader?.startsWith('Bearer ')) {
    console.error(`[AUTH][ERR] Mauvais header Authorization: "${authHeader}"`);
    return res.status(401).json({ error: 'Token manquant ou mal formé' });
  }

  const token = authHeader.split(' ')[1];
  if (!token) {
    console.error('[AUTH][ERR] Token vide après Bearer');
    return res.status(401).json({ error: 'Token vide' });
  }

  if (!secret) {
    console.error('[AUTH][ERR] JWT_SECRET non défini dans l’environnement');
    return res.status(500).json({ error: 'JWT_SECRET non défini' });
  }

  try {
    const decoded = jwt.verify(token, secret);
    const userIdNum = Number(decoded.userId);

    if (!Number.isInteger(userIdNum) || userIdNum <= 0) {
      console.error(`[AUTH][ERR] userId invalide: ${decoded.userId}`);
      return res.status(401).json({ error: 'userId invalide' });
    }

    req.user = { ...decoded, userId: userIdNum };
    console.log(`[AUTH][OK] Token valide | userId=${userIdNum}`);
    next();
  } catch (err) {
    console.error(`[AUTH][ERR] jwt.verify failed: ${err.message}`);
    return res.status(401).json({ error: 'Token invalide' });
  }
};

module.exports = authenticate;
