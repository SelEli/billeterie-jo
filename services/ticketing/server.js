require('dotenv').config();
const app = require('./app');
const { initKafka } = require('./utils/kafka.client');
const { initRedis } = require('./utils/redis.client');

// Initialisation Kafka + Redis avant le server
initKafka();
initRedis();

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`ticketing service listening on port ${PORT}`);
});
