const fs = require('fs');
const path = require('path');

const services = ['auth', 'paiement', 'ticketing', 'verification'];

const content = `
const validateBody = schema => (req, res, next) => {
  const result = schema.safeParse(req.body);
  if (!result.success) {
    return res.status(400).json({ message: 'Invalid request body', errors: result.error.errors });
  }
  req.body = result.data;
  next();
};

module.exports = validateBody;
`.trim();

for (const service of services) {
  const mwPath = path.join(__dirname, 'services', service, 'middlewares');
  fs.mkdirSync(mwPath, { recursive: true });

  const filePath = path.join(mwPath, 'validateBody.js');
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, content);
    console.log(`✅ validateBody.js injecté dans ${service}`);
  }
}
