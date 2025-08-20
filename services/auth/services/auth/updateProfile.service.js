const { prisma } = require('../../utils');

async function updateProfileService(userId, payload) {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) return null;

  return prisma.user.update({
    where: { id: userId },
    data: payload
  });
}

module.exports = { updateProfileService };
