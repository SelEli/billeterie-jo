require('dotenv').config();
const app = require('../app');
const logger = require('../utils/logger');

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  logger.info({ message: `🚀 Service gateway lancé sur le port ${PORT}` });
  console.log(`✅ [gateway] actif sur le port ${PORT}`);
});
