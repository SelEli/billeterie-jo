const fs = require('fs');
const path = require('path');

const services = ['auth', 'paiement', 'ticketing', 'verification'];

for (const service of services) {
  const loggerContent = `
const winston = require('winston');

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  defaultMeta: { service: process.env.SERVICE_NAME || '${service}' },
  transports: [
    new winston.transports.Console()
  ]
});

module.exports = logger;
`.trim();

  const utilsPath = path.join(__dirname, 'services', service, 'utils');
  fs.mkdirSync(utilsPath, { recursive: true });

  const loggerPath = path.join(utilsPath, 'logger.js');
  if (!fs.existsSync(loggerPath)) {
    fs.writeFileSync(loggerPath, loggerContent);
    console.log(`✅ logger.js ajouté dans ${service}`);
  }

  const envPath = path.join(__dirname, 'services', service, '.env.example');
  if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf8');
    if (!envContent.includes('SERVICE_NAME')) {
      fs.appendFileSync(envPath, `\nSERVICE_NAME=${service}\n`);
      console.log(`📄 SERVICE_NAME ajouté dans .env.example de ${service}`);
    }
  }
}
