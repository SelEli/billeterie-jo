// services/offer/offerQuery.service.js
const prisma = require('../../utils/prismaClient');
const { timer } = require('../../monitor/monitor');
const { cacheOffer, getCachedOffer } = require('../../cache/offer.cache');

async function offerQueryService(filter = {}, options = {}) {
  const t = timer('offerQueryService').start();
  try {
    const where = { ...(filter || {}) };
    if (typeof where.active === 'undefined') {
      where.active = true;
    }

    if (options.validNow === true) {
      const now = new Date();
      where.OR = [
        {
          AND: [
            { validFrom: { lte: now } },
            { validTo: { gte: now } }
          ]
        },
        {
          AND: [
            { validFrom: null },
            { validTo: null }
          ]
        }
      ];
    }

    const res = await prisma.offer.findMany({ where });
    t.success();
    return res;
  } catch (err) {
    t.fail(err);
    throw err;
  }
}

async function offerReadService(id) {
  const t = timer('offerReadService').start();
  try {
    const cached = await getCachedOffer(id);
    if (cached && cached.active !== false) {
      t.success();
      return cached;
    }

    const res = await prisma.offer.findUnique({
      where: { id: parseInt(id) },
      include: { tickets: true }
    });

    if (!res || res.active === false) {
      t.success();
      return null;
    }

    await cacheOffer(res);
    t.success();
    return res;
  } catch (err) {
    t.fail(err);
    throw err;
  }
}

module.exports = { offerQueryService, offerReadService };
