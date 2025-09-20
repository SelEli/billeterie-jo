// utils/index.js

// 🔐 Keys management
const keys = require('./keys');

// 🔑 JWT utilities
const jwtUtils = require('./jwt');

// 📡 Kafka
const { initKafka, publishKafkaEvent, kafka } = require('./kafkaClient');

// 🪵 Logger
const logger = require('./logger');

// ⚡ Redis
const { initRedis, getRedis } = require('./redisClient');

// 🆔 Request ID middleware
const requestId = require('./requestId');

// 📦 Uniform JSON responses
const { success, error } = require('./response');

// 💾 Payment cache
const paymentCache = require('./paymentCache');

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

  // Redis
  initRedis,
  getRedis,

  // Request ID
  requestId,

  // JSON responses
  success,
  error,

  // Payment cache
  ...paymentCache
};
