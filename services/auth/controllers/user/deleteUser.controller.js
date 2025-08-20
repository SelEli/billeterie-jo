const { prisma, logger, publishKafkaEvent } = require('../../utils');
const { success, error } = require('../../utils/response');

const deleteUserController = async (req, res) => {
  try {
    const userId = parseInt(req.params.id);
    const user = await prisma.user.findUnique({ where: { id: userId } });

    if (!user) {
      logger.warn(`User not found for deletion [id=${userId}]`);
      return res.status(404).json(error(['User not found.']));
    }

    await prisma.user.delete({ where: { id: userId } });

    logger.info(`User deleted [id=${userId}]`);
    await publishKafkaEvent('user.deleted', { userId });

    return res.status(204).json(success(null));
  } catch (err) {
    logger.error(`Error deleting user: ${err.message}`);
    return res.status(500).json(error(['Internal server error.']));
  }
};

module.exports = { deleteUserController };
