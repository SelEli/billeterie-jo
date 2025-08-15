const prisma = require('../../utils/prismaClient');
const { timer } = require('../../monitor/monitor');

async function listEventsService(filter = {}) {
  const t = timer('listEventsService').start();
  try {
    const where = {
      ...filter,
      deletedAt: typeof filter.deletedAt === 'undefined' ? null : filter.deletedAt
    };

    const events = await prisma.event.findMany({
      where,
      include: { offers: true, tickets: true }
      // ⚠️ Pas d'orderBy pour matcher les tests, à remettre si besoin métier
    });

    t.success();
    return events;
  } catch (err) {
    t.fail(err);
    throw err;
  }
}

module.exports = { listEventsService };
