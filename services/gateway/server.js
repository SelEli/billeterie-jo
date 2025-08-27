require('dotenv').config();
const logger = require('./utils/logger');
const app = require('./app');

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  logger.info({ message: `🚀 Service gateway lancé sur le port ${PORT}` });
  console.log(`✅ [gateway] actif sur le port ${PORT}`);
});
