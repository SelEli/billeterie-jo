// middlewares/auth.middleware.js
const jwt = require('jsonwebtoken');

const authenticate = (req, res, next) => {
  // 📡 Trace la méthode + l’URL → utile en test
  console.log(`📡 [AUTH] ${req.method} ${req.originalUrl}`);

  // 🔁 Ignore les requêtes CORS pre-flight
  if (req.method === 'OPTIONS') {
    console.log('🛑 [AUTH] Requête OPTIONS ignorée');
    return next();
  }

  const authHeader = req.headers.authorization;
  console.log('🔍 [AUTH] Header Authorization reçu:', authHeader);

  if (!authHeader) {
    console.log('❌ [AUTH] Header Authorization ABSENT');
    return res.status(401).json({ error: 'Token manquant' });
  }

  if (!authHeader.startsWith('Bearer ')) {
    console.log('❌ [AUTH] Header Authorization NE COMMENCE PAS par Bearer');
    return res.status(401).json({ error: 'Token mal formé' });
  }

  const token = authHeader.split(' ')[1];
  if (!token) {
    console.log('❌ [AUTH] Token APRÈS Bearer est VIDE');
    return res.status(401).json({ error: 'Token vide' });
  }

  console.log('🔐 [AUTH] Token extrait:', token);

  if (!process.env.JWT_SECRET) {
    console.log('❌ [AUTH] JWT_SECRET manquant dans process.env');
    return res.status(500).json({ error: 'JWT_SECRET non défini' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('➡️ [AUTH] Décodage complet JWT:', decoded);

    if (!decoded || typeof decoded !== 'object') {
      console.log('❌ [AUTH] Décodage échoué ou non-objet');
      return res.status(401).json({ error: 'Token invalide (structure)' });
    }

    if (!('userId' in decoded)) {
      console.log('❌ [AUTH] userId ABSENT dans decoded');
      return res.status(401).json({ error: 'userId manquant dans token' });
    }

    const userIdNum = Number(decoded.userId);
    console.log('➡️ [AUTH] userId brut:', decoded.userId, '→ converti:', userIdNum);

    if (!Number.isInteger(userIdNum) || userIdNum <= 0) {
      console.log('❌ [AUTH] userId invalide après conversion Number()', userIdNum);
      return res.status(401).json({ error: 'userId invalide' });
    }

    // 🔐 Protection contre écrasement si req.user existe déjà
    if (req.user) {
      console.log('⚠️ [AUTH] Attention, req.user existe déjà:', req.user);
    }

    req.user = { ...decoded, userId: userIdNum };
    console.log('✅ [AUTH] Middleware OK, req.user final:', req.user);

    next();
  } catch (err) {
    console.log('❌ [AUTH] Erreur lors du jwt.verify :', err.message);
    return res.status(401).json({ error: 'Token invalide' });
  }
};

module.exports = authenticate;
