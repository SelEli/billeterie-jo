const prisma = require('../../utils/prismaClient');
const { emitEventCreated } = require('../../kafka/event.kafka');
const logger = require('../../utils/logger');
const { timer } = require('../../monitor/monitor');
const { cacheEvent } = require('../../cache/event.cache');
const { ERROR_STATUS } = require('../../utils/httpErrorMap');

async function createEventService(data) {
  const t = timer('createEventService').start();

  try {
    // Whitelist des champs attendus par Prisma
    const safeData = {
      label: data.label,
      date: new Date(data.date),
      location: data.location,
      category: data.category ?? null,
      capacity: data.capacity ?? null,
      status: data.status ?? 'DRAFT',
      description: data.description ?? null,
      imageUrl: data.imageUrl ?? null
    };

    const event = await prisma.event.create({
      data: safeData,
      include: { offers: true, tickets: true }
    });

    try {
      await emitEventCreated({
        id: event.id,
        label: event.label,
        date: event.date,
        location: event.location,
        category: event.category || null
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
