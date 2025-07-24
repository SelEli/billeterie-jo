const jwt = require('jsonwebtoken');

function authMiddleware(req, res, next) {
  const auth = req.headers.authorization?.split(' ');
  if (!auth || auth[0] !== 'Bearer') {
    return res.status(401).json({ message: 'Missing or invalid auth header.' });
  }
  try {
    const payload = jwt.verify(auth[1], process.env.JWT_SECRET);
    req.user = payload;  // { userId, role, etc. }
    next();
  } catch {
    return res.status(401).json({ message: 'Unauthorized.' });
  }
}

module.exports = { authMiddleware };
