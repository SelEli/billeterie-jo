const { prisma } = require('../../utils');

async function getProfileService(userId) {
  return prisma.user.findUnique({ where: { id: userId } });
}

module.exports = { getProfileService };
