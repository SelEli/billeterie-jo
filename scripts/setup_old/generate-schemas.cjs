const fs = require('fs');
const path = require('path');

const services = ['auth', 'paiement', 'ticketing', 'verification'];

const swaggerJson = `
{
  "openapi": "3.0.0",
  "info": {
    "title": "API Documentation",
    "version": "1.0.0"
  },
  "paths": {
    "/health": {
      "get": {
        "summary": "Health check",
        "responses": {
          "200": {
            "description": "Service OK"
          }
        }
      }
    }
  }
}
`.trim();

const swaggerRoute = `
const express = require('express');
const router = express.Router();
const swaggerUi = require('swagger-ui-express');
const fs = require('fs');
const path = require('path');

const swaggerPath = path.join(__dirname, '../docs/swagger.json');
const swaggerDocument = JSON.parse(fs.readFileSync(swaggerPath, 'utf8'));

router.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
module.exports = router;
`.trim();

for (const service of services) {
  const docsPath = path.join(__dirname, 'services', service, 'docs');
  fs.mkdirSync(docsPath, { recursive: true });

  const jsonPath = path.join(docsPath, 'swagger.json');
  if (!fs.existsSync(jsonPath)) {
    fs.writeFileSync(jsonPath, swaggerJson);
    console.log(`swagger.json généré pour ${service}`);
  }

  const routesPath = path.join(__dirname, 'services', service, 'routes');
  fs.mkdirSync(routesPath, { recursive: true });

  const swaggerRoutePath = path.join(routesPath, 'swaggerDocs.js');
  if (!fs.existsSync(swaggerRoutePath)) {
    fs.writeFileSync(swaggerRoutePath, swaggerRoute);
    console.log(`Route /docs ajoutée dans ${service}`);
  }
}

console.log('Documentation Swagger injectée dans tous les services.');
