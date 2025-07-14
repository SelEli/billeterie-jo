const { verifierToken } = require('../utils/jwt');

function authMiddleware(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Token manquant' });

  const decoded = verifierToken(token);
  if (!decoded) return res.status(403).json({ error: 'Token invalide ou expiré' });

  req.user = decoded;
  next();
}

module.exports = authMiddleware;