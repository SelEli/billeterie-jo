// 🌱 Charge les variables d'environnement depuis .env
require('dotenv').config();

// 🏗️ App Express principale
const app = require('./app');

// 🚀 Initialisation des services externes
const { initKafka } = require('./utils/kafka.client');
const { initRedis } = require('./utils/redis.client');

(async () => {
  try {
    // ⚡ Initialisation Redis
    await initRedis();

    // ⚡ Initialisation Kafka
    await initKafka();

    // 🔊 Lancement du serveur
    const PORT = process.env.PORT || 3001;
    app.listen(PORT, () => {
      console.log(`✅ Ticketing service listening on port ${PORT}`);
    });

  } catch (err) {
    console.error('❌ Échec lors de l’initialisation des services :', err.message);
    process.exit(1); // ⛔ Arrêt propre en cas d’erreur
  }
})();
