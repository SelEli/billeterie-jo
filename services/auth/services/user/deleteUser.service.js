const { prisma, logger } = require('../../utils');

const deleteUserService = async (id) => {
  logger.debug(`[USER][DELETE] Deleting user [id=${id}]`);

  let deleted = null;
  try {
    deleted = await prisma.user.delete({
      where: { id: parseInt(id, 10) }
    });
  } catch {
    deleted = null;
  }

  if (!deleted) {
    logger.warn(`[USER][DELETE] User not found [id=${id}]`);
    return null;
  }

  logger.info(`[USER][DELETE] User deleted [id=${id}]`);
  return deleted; // On retourne l'objet supprimé, pas juste `true`
};

module.exports = { deleteUserService };
