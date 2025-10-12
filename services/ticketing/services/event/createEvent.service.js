const prisma = require('../../utils/prismaClient');
const { emitEventCreated } = require('../../kafka/event.kafka');
const logger = require('../../utils/logger');
const { timer } = require('../../monitor/monitor');
const { cacheEvent } = require('../../cache/event.cache');
const { ERROR_STATUS } = require('../../utils/httpErrorMap');

async function createEventService(data) {
  const t = timer('createEventService').start();

  try {
    const event = await prisma.event.create({
      data, // 👈 données déjà validées par Zod
      include: { tickets: true } // ✅ plus de offers
    });

    try {
      await emitEventCreated({
        id: event.id,
        label: event.label,
        date: event.date,
        location: event.location,
        category: event.category || null,
        basePrice: event.basePrice,
        zones: event.zones
      });
    } catch (emitErr) {
      logger.warn(`[EVENT] emitEventCreated failed: ${emitErr.message}`);
    }

    try {
      await cacheEvent(event);
    } catch (cacheErr) {
      logger.warn(`[EVENT] cacheEvent failed: ${cacheErr.message}`);
    }

    logger.info(`[EVENT] Created: ${event.id}`);
    t.success();
    return event;
  } catch (err) {
    logger.error(`[EVENT] Failed to create: ${err.message}`);
    t.fail(err);
    err.statusCode = err.statusCode || ERROR_STATUS.INTERNAL_SERVER_ERROR;
    throw err;
  }
}

module.exports = { createEventService };
