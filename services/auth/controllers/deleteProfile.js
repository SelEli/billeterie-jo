const { PrismaClient } = require('@prisma/client');
const { logger, publishKafkaEvent, generateInvisibleKey } = require('../services');

const prisma = new PrismaClient();


const deleteProfile = async (req, res) => {
  try {
    const userId = req.user.userId;
    await prisma.user.delete({ where: { id: userId } });

    logger.info(`User self-deleted [id=${userId}]`);
    await publishKafkaEvent('user.deleted', { userId });

    res.status(204).send();
  } catch (err) {
    logger.error(`Error deleting profile: ${err.message}`);
    res.status(404).json({ message: 'Profile not found.' });
  }
};

module.exports = { deleteProfile };
