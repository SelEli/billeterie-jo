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
  const routesDir = path.join(__dirname, 'services', service, 'routes');
  fs.mkdirSync(routesDir, { recursive: true });

  const routeContent = `
const express = require('express');
const router = express.Router();

router.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    service: '${service}',
    requestId: req.requestId || null
  });
});

module.exports = router;
  `.trim();

  const routePath = path.join(routesDir, 'health.js');
  fs.writeFileSync(routePath, routeContent);
  console.log('✅ Route /health générée dans : ' + routePath);
}

console.log('\n🎯 Tu peux maintenant importer la route dans chaque serveur principal :');
console.log("Exemple : app.use('/api', require('./routes/health'));\n");
