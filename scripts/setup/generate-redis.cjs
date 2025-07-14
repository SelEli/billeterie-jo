const fs = require('fs');
const path = require('path');

const services = ['auth', 'paiement', 'ticketing', 'verification'];

const redisClientContent = `
const { createClient } = require('redis');

const redis = createClient({
  url: process.env.REDIS_URL || 'redis://localhost:6379'
});

redis.on('error', err => console.error('Redis Client Error', err));
redis.connect();

module.exports = { redis };
`.trim();

for (const service of services) {
  const utilsPath = path.join(__dirname, 'services', service, 'utils');
  fs.mkdirSync(utilsPath, { recursive: true });

  const redisPath = path.join(utilsPath, 'redisClient.js');
  if (!fs.existsSync(redisPath)) {
    fs.writeFileSync(redisPath, redisClientContent);
    console.log(`✅ redisClient.js ajouté dans ${service}`);
  }

  const envPath = path.join(__dirname, 'services', service, '.env.example');
  if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf8');
    if (!envContent.includes('REDIS_URL')) {
      fs.appendFileSync(envPath, '\nREDIS_URL=redis://localhost:6379\n');
      console.log(`📄 REDIS_URL ajouté dans .env.example de ${service}`);
    }
  }
}
