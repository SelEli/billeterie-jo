// utils/index.js

// 🔐 Keys management (ex-clefs.js)
const keys = require('./keys');

// 🔑 JWT utilities
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

// 📦 Uniform JSON responses
const { success, error } = require('./response');

module.exports = {
  // Keys
  generateInvisibleKey: keys.generateInvisibleKey,
  combineKeys: keys.combineKeys,
  verifyKeys: keys.verifyKeys,

  // JWT
  ...jwtUtils,

  // Kafka
  initKafka,
  publishKafkaEvent,
  kafka,

  // Logger
  logger,
  formatLogContext: logger.formatLogContext,

  // Prisma
  prisma,

  // Redis
  initRedis,
  getRedis,

  // Request ID
  requestId,

  // JSON responses
  success,
  error
};
