const logger = require('../utils/logger');

async function timer(label, fn) {
  const start = Date.now();
  const result = await fn();
  const duration = Date.now() - start;

  logger.info(`[monitor] ${label} took ${duration}ms`);
  return { result, duration };
}

module.exports = { timer };
