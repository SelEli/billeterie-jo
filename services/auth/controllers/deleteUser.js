const { PrismaClient } = require('@prisma/client');
const { logger, publishKafkaEvent, generateInvisibleKey } = require('../services');

const prisma = new PrismaClient();


const deleteUser = async (req, res) => {
  try {
    const userId = parseInt(req.params.id);
    await prisma.user.delete({ where: { id: userId } });

    logger.info(`User deleted [id=${userId}]`);
    await publishKafkaEvent('user.deleted', { userId });

    res.status(204).send();
  } catch (err) {
    logger.error(`Error deleting user: ${err.message}`);
    res.status(404).json({ message: 'User not found.' });
  }
};

module.exports = { deleteUser };
