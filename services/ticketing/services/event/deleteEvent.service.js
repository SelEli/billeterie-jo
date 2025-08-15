const prisma = require('../../utils/prismaClient');
const { emitEventDeleted } = require('../../kafka/event.kafka');
const logger = require('../../utils/logger');
const { timer } = require('../../monitor/monitor');
const { invalidateEventCache } = require('../../cache/event.cache');

async function deleteEventService(id) {
  const t = timer('deleteEventService').start();
  try {
    const eventId = Number(id);
    if (isNaN(eventId)) {
      const err = new Error('Invalid event ID');
      err.statusCode = 400;
      throw err;
    }

    const existing = await prisma.event.findUnique({
      where: { id: eventId },
      select: { deletedAt: true }
    });

    if (!existing) {
      const err = new Error('Event not found'); // 🛠 harmonisé
      err.statusCode = 404;
      throw err;
    }
    if (existing.deletedAt) {
      logger.info(`[EVENT] Already deleted: ${eventId}`);
      t.success();
      return { id: eventId, deletedAt: existing.deletedAt };
    }

    const deleted = await prisma.event.update({
      where: { id: eventId },
      data: { deletedAt: new Date() },
      include: { offers: true, tickets: true }
    });

    try {
      await emitEventDeleted(deleted.id);
    } catch (emitErr) {
      logger.warn(`[EVENT] emitEventDeleted failed: ${emitErr.message}`);
    }
    try {
      await invalidateEventCache(deleted.id);
    } catch (cacheErr) {
      logger.warn(`[EVENT] invalidateEventCache failed: ${cacheErr.message}`);
    }

    logger.info(`[EVENT] Deleted: ${deleted.id}`);
    t.success();
    return deleted;
  } catch (err) {
    logger.error(`[EVENT] Failed to delete ${id}: ${err.message}`);
    t.fail(err);
    throw err;
  }
}

module.exports = { deleteEventService };
