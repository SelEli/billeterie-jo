// services/event/updateEvent.service.js
const prisma = require('../../utils/prismaClient');
const { emitEventUpdated } = require('../../kafka/event.kafka');
const logger = require('../../utils/logger');
const { timer } = require('../../monitor/monitor');
const { cacheEvent } = require('../../cache/event.cache');

async function updateEventService(id, data) {
  const t = timer('updateEventService').start();
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

    if (!existing || existing.deletedAt) {
      // ✅ Libellé aligné sur ce qu'attend le test
      const err = new Error('Event not found or deleted');
      err.statusCode = 404;
      throw err;
    }

    const updated = await prisma.event.update({
      where: { id: eventId },
      data,
      include: { offers: true, tickets: true }
    });

    try {
      await emitEventUpdated({ id: updated.id, changes: data });
    } catch (emitErr) {
      logger.warn(`[EVENT] emitEventUpdated failed: ${emitErr.message}`);
    }

    try {
      await cacheEvent(updated);
    } catch (cacheErr) {
      logger.warn(`[EVENT] cacheEvent failed: ${cacheErr.message}`);
    }

    logger.info(`[EVENT] Updated: ${updated.id}`);
    t.success();
    return updated;
  } catch (err) {
    logger.error(`[EVENT] Failed to update ${id}: ${err.message}`);
    t.fail(err);
    throw err;
  }
}

module.exports = { updateEventService };
