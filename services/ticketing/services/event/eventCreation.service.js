// services/event/eventCreation.service.js
const prisma = require('../../prisma/client');
const { emitEventCreated } = require('../../kafka/event.kafka');
const logger = require('../../utils/logger');
const { timer } = require('../../monitor/monitor');

async function eventCreationService(data) {
  const t = timer('eventCreationService').start();
  try {
    const event = await prisma.event.create({ data });
    await emitEventCreated({
      id: event.id,
      label: event.label,
      date: event.date,
      location: event.location,
      category: event.category || null
    });
    logger.info(`Event created: ${event.id}`);
    t.success();
    return event;
  } catch (err) {
    t.fail(err);
    throw err;
  }
}

module.exports = eventCreationService;
