// app.js
require('dotenv').config();
const express = require('express');
const app = express();

const logger = require('./middlewares/logger');
const authMiddleware = require('./middlewares/auth');

app.use(express.json());
app.use(logger);

app.use('/auth', require('./routes/auth'));
app.use('/tickets', authMiddleware, require('./routes/tickets'));
app.use('/payment', authMiddleware, require('./routes/payment'));
app.use('/verify', authMiddleware, require('./routes/verify'));

module.exports = app;
