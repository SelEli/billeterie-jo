// utils/index.js

// 🔐 Gestion des clés
const clefs = require('./clefs');

// 🔑 JWT
const jwtUtils = require('./jwt');

// 📡 Kafka
const { initKafka, publishKafkaEvent, kafka } = require('./kafkaClient');

// 🪵 Logger
const logger = require('./logger');

// 🗄 Prisma
const prisma = require('./prismaClient');

// ⚡ Redis
const { initRedis, getRedis } = require('./redisClient');

// 🆔 Request ID middleware
const requestId = require('./requestId');

// 📦 Réponses uniformes (TypeScript → import via require)
const { success, error } = require('./response');

module.exports = {
  // Clés & JWT
  clefs,
  ...jwtUtils,

  // Kafka
  initKafka,
  publishKafkaEvent,
  kafka,

  // Logger
  logger,
  formatLogContext: logger.formatLogContext, // <-- ajout ici

  // Prisma
  prisma,

  // Redis
  initRedis,
  getRedis,

  // Request ID
  requestId,

  // Réponses JSON
  success,
  error
};
