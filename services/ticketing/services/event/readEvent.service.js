const prisma = require('../../utils/prismaClient');
const { cacheEvent, getCachedEvent } = require('../../cache/event.cache');
const { timer } = require('../../monitor/monitor');

async function readEventService(id) {
  const t = timer('readEventService').start();
  try {
    const eventId = Number(id);
    if (isNaN(eventId)) {
      const err = new Error('Invalid event ID');
      err.statusCode = 400;
      throw err;
    }

    const cached = await getCachedEvent(eventId);
    if (cached) {
      t.success();
      return cached;
    }

    const event = await prisma.event.findUnique({
      where: { id: eventId },
      include: { tickets: true } // ✅ plus de offers
    });

    if (!event || event.deletedAt) {
      const err = new Error('Event not found');
      err.statusCode = 404;
      throw err;
    }

    try {
      await cacheEvent(event);
    } catch (cacheErr) {
      console.warn(`[EVENT] cacheEvent failed: ${cacheErr.message}`);
    }

    t.success();
    return event;
  } catch (err) {
    t.fail(err);
    throw err;
  }
}

module.exports = { readEventService };
