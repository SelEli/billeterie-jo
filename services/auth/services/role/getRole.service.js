const { prisma } = require('../../utils');

async function getRoleService(roleId) {
  return prisma.role.findUnique({ where: { id: parseInt(roleId, 10) } });
}

module.exports = { getRoleService };
