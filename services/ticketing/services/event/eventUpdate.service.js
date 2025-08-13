// services/event/eventUpdate.service.js
const prisma = require('../../prisma/client');
const { emitEventUpdated } = require('../../kafka/event.kafka');
const logger = require('../../utils/logger');
const { timer } = require('../../monitor/monitor');

async function eventUpdateService(id, data) {
  const t = timer('eventUpdateService').start();
  try {
    const numericId = parseInt(id);
    const existing = await prisma.event.findUnique({
      where: { id: numericId },
      select: { deletedAt: true }
    });
    if (!existing || existing.deletedAt) {
      throw new Error('Event not found or deleted');
    }

    const updated = await prisma.event.update({
      where: { id: numericId },
      data
    });

    await emitEventUpdated({ id: updated.id, changes: data });
    logger.info(`Event updated: ${updated.id}`);
    t.success();
    return updated;
  } catch (err) {
    t.fail(err);
    throw err;
  }
}

module.exports = eventUpdateService;
