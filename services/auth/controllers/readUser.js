const { PrismaClient } = require('@prisma/client');
const { logger } = require('../services');

const prisma = new PrismaClient();


const readUser = async (req, res) => {
  try {
    const userId = parseInt(req.params.id);
    const user = await prisma.user.findUnique({ where: { id: userId } });

    if (!user) {
      logger.warn(`User not found [id=${userId}]`);
      return res.status(404).json({ message: 'User not found.' });
    }

    res.status(200).json(user);
  } catch (err) {
    logger.error(`Error reading user: ${err.message}`);
    res.status(500).json({ message: 'Internal server error.' });
  }
};

module.exports = { readUser };
