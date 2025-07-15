const fs = require('fs');
const path = require('path');

const resources = {
  auth: ['utilisateur'],
  paiement: ['paiement'],
  ticketing: ['billet', 'offre', 'evenement'],
  verification: ['scan']
};

for (const [service, entities] of Object.entries(resources)) {
  const basePath = path.join(__dirname, '../../services', service);

  for (const entity of entities) {
    const ctrlPath = path.join(basePath, 'controllers');
    const schemasPath = path.join(basePath, 'schemas');
    const routesPath = path.join(basePath, 'routes');

    fs.mkdirSync(ctrlPath, { recursive: true });
    fs.mkdirSync(schemasPath, { recursive: true });
    fs.mkdirSync(routesPath, { recursive: true });

    // Controllers
    ['create', 'read', 'update', 'delete'].forEach(action => {
      const file = path.join(ctrlPath, `${action}${capitalize(entity)}.js`);
      if (!fs.existsSync(file)) {
        fs.writeFileSync(file, stubController(action, entity));
      }
    });

    // Schemas
    ['create', 'update'].forEach(type => {
      const file = path.join(schemasPath, `${type}${capitalize(entity)}.js`);
      if (!fs.existsSync(file)) {
        fs.writeFileSync(file, stubSchema(type, entity));
      }
    });

    // Route
    const routeFile = path.join(routesPath, `${entity}.js`);
    if (!fs.existsSync(routeFile)) {
      fs.writeFileSync(routeFile, stubRoute(entity));
    }

    console.log(`CRUD généré pour ${entity} dans ${service}`);
  }
}

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function stubController(action, entity) {
  return `
const ${action}${capitalize(entity)} = async (req, res) => {
  try {
    // TODO: logique métier pour ${action} ${entity}
    res.status(200).json({ message: '${action} ${entity} OK' });
  } catch (error) {
    res.status(500).json({ error: 'Erreur ${action} ${entity}' });
  }
};

module.exports = { ${action}${capitalize(entity)} };
`.trim();
}

function stubSchema(type, entity) {
  return `
const { z } = require('zod');

const ${type}${capitalize(entity)}Schema = z.object({
  // TODO: définir les champs pour ${type} ${entity}
});

module.exports = { ${type}${capitalize(entity)}Schema };
`.trim();
}

function stubRoute(entity) {
  return `
const express = require('express');
const router = express.Router();
const { create${capitalize(entity)} } = require('../controllers/create${capitalize(entity)}');
const { read${capitalize(entity)} } = require('../controllers/read${capitalize(entity)}');
const { update${capitalize(entity)} } = require('../controllers/update${capitalize(entity)}');
const { delete${capitalize(entity)} } = require('../controllers/delete${capitalize(entity)}');

router.post('/', create${capitalize(entity)});
router.get('/:id', read${capitalize(entity)});
router.put('/:id', update${capitalize(entity)});
router.delete('/:id', delete${capitalize(entity)});

module.exports = router;
`.trim();
}
