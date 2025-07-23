const Redis = require('ioredis');
let client;

function initRedis() {
  client = new Redis(process.env.REDIS_URL);
  client.on('error', console.error);
}

function getRedis() {
  if (!client) throw new Error('Redis not initialized');
  return client;
}

module.exports = { initRedis, getRedis };
