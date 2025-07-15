const fs = require('fs');
const path = require('path');

const services = ['auth', 'paiement', 'ticketing', 'verification'];
const utilsFiles = {
  logger: "module.exports = require('winston');",
  requestId: "module.exports = (req, res, next) => { req.id = Date.now(); next(); };",
  clefs: "module.exports = { generate: () => crypto.randomBytes(32).toString('hex') };"
};

for (const service of services) {
  const dir = path.join(__dirname, '../../services', service, 'utils');
  fs.mkdirSync(dir, { recursive: true });

  for (const [fileName, content] of Object.entries(utilsFiles)) {
    const filePath = path.join(dir, `${fileName}.js`);
    if (!fs.existsSync(filePath)) fs.writeFileSync(filePath, content);
  }

  console.log(`✅ Utils injectés dans ${service}`);
}
