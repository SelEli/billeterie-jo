const prisma = require('../../utils/prismaClient');
const { emitEventCreated } = require('../../kafka/event.kafka');
const logger = require('../../utils/logger');
const { timer } = require('../../monitor/monitor');
const { cacheEvent } = require('../../cache/event.cache');

async function createEventService(data) {
  const t = timer('createEventService').start();
  try {
    ['label', 'date', 'location', 'category'].forEach((f) => {
      if (!data[f] || (f === 'date' && isNaN(new Date(data.date)))) {
        const err = new Error(`${f} is required${f === 'date' ? ' and must be valid' : ''}`);
        err.statusCode = 400;
        throw err;
      }
    });

    const event = await prisma.event.create({ data, include: { offers: true, tickets: true } });

    await emitEventCreated({
      id: event.id,
      label: event.label,
      date: event.date,
      location: event.location,
      category: event.category || null
    });

    await cacheEvent(event);
    logger.info(`[EVENT] Created: ${event.id}`);

    t.success();
    return event;
  } catch (err) {
    logger.error(`[EVENT] Failed to create: ${err.message}`);
    t.fail(err);
    throw err;
  }
}

module.exports = { createEventService };
