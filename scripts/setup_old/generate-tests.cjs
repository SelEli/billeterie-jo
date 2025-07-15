const fs = require('fs');
const path = require('path');

const structure = {
  auth: ['utilisateur'],
  paiement: ['paiement'],
  ticketing: ['billet', 'offre', 'evenement'],
  verification: ['scan']
};

for (const [service, resources] of Object.entries(structure)) {
  const testsPath = path.join(__dirname, '../../services', service, 'tests');
  fs.mkdirSync(testsPath, { recursive: true });

  for (const ressource of resources) {
    const testFile = path.join(testsPath, `${ressource}.test.js`);
    if (!fs.existsSync(testFile)) {
      fs.writeFileSync(testFile, stubTest(ressource));
      console.log(`Test Jest créé pour ${ressource} dans ${service}`);
    }
  }
}

function stubTest(ressource) {
  return `
const request = require('supertest');
const app = require('../src/index');

describe('${ressource} routes', () => {
  it('should create ${ressource}', async () => {
    const res = await request(app)
      .post('/api/${ressource}')
      .send({ /* données de test */ });

    expect(res.statusCode).toBe(200); // adapter selon logique
  });

  // Ajouter tests read, update, delete si besoin
});
`.trim();
}
