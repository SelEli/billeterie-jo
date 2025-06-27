// Middleware de contrôle des rôles (admin, employé, etc.)

module.exports = (rolesAutorises = []) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Utilisateur non authentifié.' });
    }

    const role = req.user.role;

    if (!rolesAutorises.includes(role)) {
      return res.status(403).json({ message: 'Accès refusé : rôle insuffisant.' });
    }

    next();
  };
};
