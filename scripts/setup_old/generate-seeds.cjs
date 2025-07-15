const fs = require('fs');
const path = require('path');

const structure = {
  auth: ['utilisateur'],
  paiement: ['paiement'],
  ticketing: ['billet', 'offre', 'evenement'],
  verification: ['scan']
};

for (const [service, resources] of Object.entries(structure)) {
  const seedPath = path.join(__dirname, '../../services', service, 'seed');
  fs.mkdirSync(seedPath, { recursive: true });

  for (const ressource of resources) {
    const filePath = path.join(seedPath, `${ressource}.seed.js`);
    if (!fs.existsSync(filePath)) {
      fs.writeFileSync(filePath, stubSeed(ressource));
      console.log(`Seed créé pour ${ressource} dans ${service}`);
    }
  }
}

function stubSeed(ressource) {
  return `
module.exports = [
  {
    id: 'example-id-123',
    statut: 'actif',
    // autres propriétés de ${ressource} à adapter
  }
];
`.trim();
}
