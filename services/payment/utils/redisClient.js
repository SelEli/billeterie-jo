const Redis = require('ioredis');
const logger = require('./logger');

let client;

function initRedis() {
  client = new Redis(process.env.REDIS_URL);
  client.on('connect', () => logger.info(`[redis] Connecté à ${process.env.REDIS_URL}`));
  client.on('error', (err) => logger.error(`[redis] Erreur: ${err.message}`));
}

function getRedis() {
  if (!client) throw new Error('Redis not initialized');
  return client;
}

module.exports = { initRedis, getRedis };
