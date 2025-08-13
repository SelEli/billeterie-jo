// services/event/eventQuery.service.js
const prisma = require('../../prisma/client');
const { timer } = require('../../monitor/monitor');

async function eventQueryService(filter = {}) {
  const t = timer('eventQueryService').start();
  try {
    // Exclure par défaut les événements soft-deleted
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
    const numericId = parseInt(id);
    const res = await prisma.event.findUnique({
      where: { id: numericId },
      include: { tickets: true }
    });
    // Masquer les events supprimés
    if (!res || res.deletedAt) {
      t.success();
      return null;
    }
    t.success();
    return res;
  } catch (err) {
    t.fail(err);
    throw err;
  }
}

module.exports = { eventQueryService, eventReadService };
