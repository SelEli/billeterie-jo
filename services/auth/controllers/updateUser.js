const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');
const { logger } = require('../services');

const prisma = new PrismaClient();

const updateUser = async (req, res) => {
  try {
    const userId = parseInt(req.params.id);
    const { firstName, lastName, email, password, birthDate, role } = req.body;

    const existing = await prisma.user.findUnique({ where: { id: userId } });
    if (!existing) {
      logger.warn(`User not found for update [id=${userId}]`);
      return res.status(404).json({ message: 'User not found.' });
    }

    const data = {};
    if (firstName) data.firstName = firstName;
    if (lastName) data.lastName = lastName;
    if (email) data.email = email.toLowerCase().trim();
    if (password) data.hash = await bcrypt.hash(password, 10);
    if (birthDate) data.birthDate = new Date(birthDate);
    if (role) data.role = role;

    const updated = await prisma.user.update({ where: { id: userId }, data });

    logger.info(`User updated [id=${userId}]`);
    res.status(200).json({ message: 'User updated.', user: updated });
  } catch (err) {
    logger.error(`Error updating user: ${err.message}`);
    res.status(500).json({ message: 'Internal server error.' });
  }
};

module.exports = { updateUser };
