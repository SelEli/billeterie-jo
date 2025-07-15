const { PrismaClient } = require('@prisma/client');
const { logger, publishKafkaEvent, generateInvisibleKey } = require('../services');

const prisma = new PrismaClient();


const getProfile = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({ where: { id: req.user.userId } });

    if (!user) {
      logger.warn(`Profile not found for userId=${req.user.userId}`);
      return res.status(404).json({ message: 'Profile not found.' });
    }

    res.status(200).json(user);
  } catch (err) {
    logger.error(`Error fetching profile: ${err.message}`);
    res.status(500).json({ message: 'Internal server error.' });
  }
};

module.exports = { getProfile };
