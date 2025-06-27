module.exports = (err, req, res, next) => {
  console.error('[ERROR]', err.stack || err);

  const statusCode = err.statusCode || 500;
  const message = err.message || 'Erreur interne du serveur';

  res.status(statusCode).json({
    success: false,
    error: message
  });
};
