// services/offer/offerQuery.service.js
const prisma = require('../../prisma/client');
const { timer } = require('../../monitor/monitor');

async function offerQueryService(filter = {}, options = {}) {
  const t = timer('offerQueryService').start();
  try {
    const where = { ...(filter || {}) };

    // Par défaut, ne retourner que les offres actives
    if (typeof where.active === 'undefined') {
      where.active = true;
    }

    // Filtrage de validité temporelle "valide maintenant"
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
    const numericId = parseInt(id);
    const res = await prisma.offer.findUnique({
      where: { id: numericId },
      include: { tickets: true }
    });
    // Masquer les offres inactives côté public
    if (!res || res.active === false) {
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

module.exports = { offerQueryService, offerReadService };
