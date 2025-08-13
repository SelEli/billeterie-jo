// services/event/eventDelete.service.js
const prisma = require('../../prisma/client');
const { emitEventDeleted } = require('../../kafka/event.kafka');
const logger = require('../../utils/logger');
const { timer } = require('../../monitor/monitor');

async function eventDeleteService(id) {
  const t = timer('eventDeleteService').start();
  try {
    const numericId = parseInt(id);
    const existing = await prisma.event.findUnique({
      where: { id: numericId },
      select: { deletedAt: true }
    });
    if (!existing) {
      throw new Error('Event not found');
    }
    if (existing.deletedAt) {
      // Idempotent: déjà supprimé
      logger.warn(`Event already deleted: ${numericId}`);
      t.success();
      return { id: numericId, deletedAt: existing.deletedAt };
    }

    const deleted = await prisma.event.update({
      where: { id: numericId },
      data: { deletedAt: new Date() }
    });

    await emitEventDeleted(deleted.id);
    logger.warn(`Event deleted: ${deleted.id}`);
    t.success();
    return deleted;
  } catch (err) {
    t.fail(err);
    throw err;
  }
}

module.exports = eventDeleteService;
