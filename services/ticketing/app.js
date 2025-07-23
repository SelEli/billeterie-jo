const express = require('express');
const bodyParser = require('body-parser');
const ticketRoutes = require('./routes/ticket.routes');
const { authMiddleware } = require('./middlewares/auth.middleware');

const app = express();
app.use(bodyParser.json());
app.use(authMiddleware);

// Toutes les routes liées aux tickets
app.use('/ticketing/ticket', ticketRoutes);

// Middleware d’erreur générique
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ message: 'Internal server error.' });
});

module.exports = app;
