// services/event/readEvent.service.js
const prisma = require('../../utils/prismaClient');
const { cacheEvent, getCachedEvent } = require('../../cache/event.cache');
const { timer } = require('../../monitor/monitor');

async function readEventService(id) {
  const t = timer('readEventService').start();
  try {
    const cached = await getCachedEvent(id);
    if (cached) return t.success(), cached;

    const event = await prisma.event.findUnique({
      where: { id: Number(id) },
      include: { offers: true, tickets: true }
    });

    if (!event || event.deletedAt) {
      const err = new Error('Event not found');
      err.statusCode = 404;
      throw err;
    }

    await cacheEvent(event);
    t.success();
    return event;
  } catch (err) {
    t.fail(err);
    throw err;
  }
}

module.exports = { readEventService };
