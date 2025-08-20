const { prisma, logger, publishKafkaEvent } = require('../../utils');
const { success, error } = require('../../utils/response');

const deleteProfileController = async (req, res) => {
  try {
    const userId = req.user.userId;
    await prisma.user.delete({ where: { id: userId } });

    logger.info(`User self-deleted [id=${userId}]`);
    await publishKafkaEvent('user.deleted', { userId });

    return res.status(204).json(success(null));
  } catch (err) {
    logger.error(`Error deleting profile: ${err.message}`);
    return res.status(404).json(error(['Profile not found.']));
  }
};

module.exports = { deleteProfileController };
