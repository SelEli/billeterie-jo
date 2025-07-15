const express = require('express');
const app = express();

require('dotenv').config();
app.use(express.json());

app.use('/auth', require('./routes/auth'));
app.use('/users', require('./routes/user'));
app.use('/health', require('./routes/health'));

app.use((req, res) => {
  res.status(404).json({ message: 'Route not found.' });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something broke.' });
});

module.exports = app;
