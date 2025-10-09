const { generateInvisibleKey, combineKeys, verifyKeys } = require('./keys');
const jwtUtils = require('./jwt');
const { initKafka, publishKafkaEvent, kafka, startKafkaConsumer } = require('./kafkaClient');
const logger = require('./logger');
const prisma = require('./prismaClient');
const { initRedis, getRedis } = require('./redisClient');
const requestId = require('./requestId');
const { success, error } = require('./response');
const { ERROR_STATUS, statusFrom } = require('./httpErrorMap');
const { SUCCESS_STATUS, successFrom } = require('./httpSuccessMap');
const { sendBusinessError } = require('./sendError');
const { sendBusinessSuccess } = require('./sendSuccess');
const { startConsumer, requestPayment, requestVerification } = require('./kafkaConsumer'); // 👈 ton fichier consumer

module.exports = {
  generateInvisibleKey,
  combineKeys,
  verifyKeys,
  ...jwtUtils,
  initKafka,
  publishKafkaEvent,
  kafka,
  startKafkaConsumer,
  logger,
  formatLogContext: logger.formatLogContext,
  prisma,
  initRedis,
  getRedis,
  requestId,
  success,
  error,
  ERROR_STATUS,
  statusFrom,
  SUCCESS_STATUS,
  successFrom,
  sendBusinessError,
  sendBusinessSuccess,
  startConsumer,
  requestPayment,
  requestVerification
};
