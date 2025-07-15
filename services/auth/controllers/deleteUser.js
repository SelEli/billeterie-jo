const { PrismaClient } = require('@prisma/client');
const { logger, publishKafkaEvent } = require('../services');

const prisma = new PrismaClient();

const deleteUser = async (req, res) => {
  try {
    const userId = parseInt(req.params.id);
    const user = await prisma.user.findUnique({ where: { id: userId } });

    if (!user) {
      logger.warn(`User not found for deletion [id=${userId}]`);
      return res.status(404).json({ message: 'User not found.' });
    }

    await prisma.user.delete({ where: { id: userId } });

    logger.info(`User deleted [id=${userId}]`);
    await publishKafkaEvent('user.deleted', { userId });

    res.status(204).send();
  } catch (err) {
    logger.error(`Error deleting user: ${err.message}`);
    res.status(500).json({ message: 'Internal server error.' });
  }
};

module.exports = { deleteUser };
