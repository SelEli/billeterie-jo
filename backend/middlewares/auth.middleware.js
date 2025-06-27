const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  const authHeader = req.headers.authorization;

  // Vérifie que le header Authorization est présent et bien formé
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Accès refusé : token manquant ou mal formé.' });
  }

  const token = authHeader.split(' ')[1];

  try {
    // Vérifie le token JWT
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attache les infos utiles du token à req.user
    req.user = {
      utilisateurId: decoded.utilisateurId,
      nom: decoded.nom || null,
      prenom: decoded.prenom || null,
      role: decoded.role || 'utilisateur'
    };

    next();
  } catch (error) {
    console.error('[AUTH][JWT]', error.message);
    return res.status(401).json({ message: 'Token invalide ou expiré.' });
  }
};
