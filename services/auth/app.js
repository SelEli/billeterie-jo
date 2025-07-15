const express = require('express');
const app = express();

require('dotenv').config();
app.use(express.json());

// Routes principales
app.use('/auth', require('./routes/auth'));
app.use('/user', require('./routes/user')); // ← corrigé ici
app.use('/health', require('./routes/health'));

// 404 not found
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found.' });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something broke.' });
});

module.exports = app;
