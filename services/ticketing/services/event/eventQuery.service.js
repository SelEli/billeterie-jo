// services/event/eventQuery.service.js
const prisma = require('../../utils/prismaClient');
const { timer } = require('../../monitor/monitor');
const { cacheEvent, getCachedEvent } = require('../../cache/event.cache');

async function eventQueryService(filter = {}) {
  const t = timer('eventQueryService').start();
  try {
    const where = { ...(filter || {}) };
    if (typeof where.deletedAt === 'undefined') {
      where.deletedAt = null;
    }
    const res = await prisma.event.findMany({ where });
    t.success();
    return res;
  } catch (err) {
    t.fail(err);
    throw err;
  }
}

async function eventReadService(id) {
  const t = timer('eventReadService').start();
  try {
    const cached = await getCachedEvent(id);
    if (cached) {
      t.success();
      return cached;
    }

    const res = await prisma.event.findUnique({
      where: { id: parseInt(id) },
      include: { tickets: true }
    });

    if (!res || res.deletedAt) {
      t.success();
      return null;
    }

    await cacheEvent(res);
    t.success();
    return res;
  } catch (err) {
    t.fail(err);
    throw err;
  }
}

module.exports = { eventQueryService, eventReadService };
