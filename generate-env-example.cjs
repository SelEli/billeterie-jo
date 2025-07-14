const fs = require('fs');
const path = require('path');

const services = [
  'auth',
  'paiement',
  'ticketing',
  'verification',
  'gateway'
];

const envContent = `
PORT=
DATABASE_URL=
JWT_SECRET=
CLEF_SIGNATURE_SECRET=
STRIPE_SECRET_KEY=
REDIS_URL=redis://redis:6379
SERVICE_NAME=
`;

for (const service of services) {
  const filePath = path.join(__dirname, 'services', service, '.env.example');
  fs.writeFileSync(filePath, envContent.trim());
  console.log('✅ .env.example généré: ' + filePath);
}

console.log('\n📦 Fichiers .env.example créés pour tous les services.');
