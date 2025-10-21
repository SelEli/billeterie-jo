const express = require('express');
const router = express.Router();
const swaggerUi = require('swagger-ui-express');
const fs = require('fs');
const path = require('path');

const swaggerPath = path.join(__dirname, '../docs/swagger.json');
const swaggerDocument = JSON.parse(fs.readFileSync(swaggerPath, 'utf8'));

router.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
module.exports = router;