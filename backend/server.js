require('dotenv').config();

const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const helmet = require('helmet');

dotenv.config();
const app = express();

// 🔐 Middlewares globaux de sécurité
app.use(
  cors({
    origin: process.env.NODE_ENV === 'production'
      ? 'https://www.tonsiteprod.fr'
      : '*'
  })
);
app.use(helmet());
app.use(express.json());

// 🛣️ Import des routes applicatives
app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/evenements', require('./routes/evenement.routes'));
app.use('/api/achat', require('./routes/achat.routes'));
app.use('/api/validation', require('./routes/validation.routes'));
app.use('/api/offres', require('./routes/offre.routes'));
app.use('/api/export', require('./routes/export.routes'));
app.use('/api/qrcode', require('./routes/qrcode.routes'));
app.use('/api/protected', require('./routes/protected.routes')); // tests Jest
app.use('/api/utilisateur', require('./routes/utilisateur.routes'));

// 🩺 Endpoint de santé
app.get('/api/ping', (req, res) => {
  res.json({ status: 'ok' });
});

// 🎉 Accueil
app.get('/', (req, res) => {
  res.send('Bienvenue sur l’API Billetterie JO');
});

// ❌ 404 Fallback
app.use((req, res) => {
  res.status(404).json({ message: 'Ressource introuvable' });
});

module.exports = app;
