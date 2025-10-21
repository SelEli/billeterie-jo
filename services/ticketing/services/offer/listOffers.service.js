const prisma = require('../../utils/prismaClient');
const { timer } = require('../../monitor/monitor');

async function listOffersService(filter = {}) {
  const t = timer('listOffersService').start();
  try {
    const where = { ...filter }; // ✅ supprimé deletedAt : champ inexistant

    const offers = await prisma.offer.findMany({
      where,
      orderBy: { id: 'desc' }
    });

    t.success();
    return offers;
  } catch (err) {
    t.fail(err);
    throw err;
  }
}

module.exports = { listOffersService };
