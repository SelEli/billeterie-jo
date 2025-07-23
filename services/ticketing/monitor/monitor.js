const logger = require('../utils/logger');

async function timer(name, fn) {
  const start = Date.now();
  const result = await fn();
  const duration = Date.now() - start;
  logger.info(`[monitor] ${name} took ${duration}ms`);
  return { ...result && { ...result }, duration };
}

module.exports = { timer };
