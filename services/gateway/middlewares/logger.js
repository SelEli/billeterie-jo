// middlewares/logger.js
module.exports = (req, res, next) => {
  console.log(`[${req.method}] ${req.originalUrl}`);
  next();
};
