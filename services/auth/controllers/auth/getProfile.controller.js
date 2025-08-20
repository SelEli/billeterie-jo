const { prisma, logger } = require('../../utils');
const { success, error } = require('../../utils/response');

const getProfileController = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({ where: { id: req.user.userId } });

    if (!user) {
      logger.warn(`Profile not found for userId=${req.user.userId}`);
      return res.status(404).json(error(['Profile not found.']));
    }

    return res.status(200).json(success(user));
  } catch (err) {
    logger.error(`Error fetching profile: ${err.message}`);
    return res.status(500).json(error(['Internal server error.']));
  }
};

module.exports = { getProfileController };
