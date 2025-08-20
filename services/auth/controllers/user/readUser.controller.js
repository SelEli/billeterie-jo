const { prisma, logger } = require('../../utils');
const { success, error } = require('../../utils/response');

const readUserController = async (req, res) => {
  try {
    const userId = parseInt(req.params.id);
    const user = await prisma.user.findUnique({ where: { id: userId } });

    if (!user) {
      logger.warn(`User not found [id=${userId}]`);
      return res.status(404).json(error(['User not found.']));
    }

    return res.status(200).json(success(user));
  } catch (err) {
    logger.error(`Error reading user: ${err.message}`);
    return res.status(500).json(error(['Internal server error.']));
  }
};

module.exports = { readUserController };
