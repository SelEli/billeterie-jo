const jwt = require('jsonwebtoken');
const { logger } = require('../services');

const auth = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    logger.warn('Access denied: no token provided.');
    return res.status(401).json({ message: 'No token provided.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = {
      userId: decoded.userId,
      role: decoded.role,
      invisibleKey: decoded.invisibleKey,
      firstName: decoded.firstName,
      lastName: decoded.lastName
    };
    logger.info(`Authenticated request from userId=${decoded.userId}`);
    next();
  } catch (err) {
    logger.warn('Access denied: invalid token.');
    return res.status(401).json({ message: 'Invalid token.' });
  }
};
module.exports = auth;
