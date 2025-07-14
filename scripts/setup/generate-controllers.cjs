const fs = require('fs');
const path = require('path');

const controllers = {
  auth: ['registerUser.js'],
  paiement: ['acheterBillet.js'],
  ticketing: ['createTicket.js'],
  verification: ['scanTicket.js'],
  gateway: []
};

for (const [service, files] of Object.entries(controllers)) {
  const basePath = path.join(__dirname, 'services', service, 'controllers');
  fs.mkdirSync(basePath, { recursive: true });

  for (const file of files) {
    const filePath = path.join(basePath, file);
    if (!fs.existsSync(filePath)) {
      const boilerplate = `
const ${file.replace('.js', '')} = async (req, res) => {
  try {
    // TODO: Implement controller logic for ${file}
    res.status(200).json({ message: '${file} stub is active' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { ${file.replace('.js', '')} };
      `.trim();

      fs.writeFileSync(filePath, boilerplate);
      console.log('✅ Controller file created:', filePath);
    } else {
      console.log('⚠️ Already exists:', filePath);
    }
  }
}

console.log('\n📦 All controller folders and stubs are ready.');
