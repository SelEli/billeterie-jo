const fs = require('fs');
const path = require('path');

const services = [
  'auth',
  'paiement',
  'ticketing',
  'verification',
  'gateway'
];

for (const service of services) {
  const srcPath = path.join(__dirname, 'services', service, 'src');
  fs.mkdirSync(srcPath, { recursive: true });

  const content = `
const express = require('express');
const dotenv = require('dotenv');
const assignRequestId = require('../utils/requestId');
const logger = require('../utils/logger');

dotenv.config();

const app = express();
app.use(express.json());
app.use(assignRequestId);

// Middleware de log par requête
app.use((req, res, next) => {
  logger.info({
    message: '📥 Requête entrante',
    service: '${service}',
    method: req.method,
    path: req.path,
    requestId: req.requestId
  });
  next();
});

// Route /api/health
app.use('/api', require('../routes/health'));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  logger.info({ message: \`🚀 Service ${service} lancé sur le port \${PORT}\` });
  console.log(\`✅ [${service}] actif sur le port \${PORT}\`);
});
  `.trim();

  const filePath = path.join(srcPath, 'index.js');
  fs.writeFileSync(filePath, content);
  console.log('✅ index.js généré dans : ' + filePath);
}

console.log('\n📦 Tous les services ont maintenant un index.js prêt à démarrer.');
