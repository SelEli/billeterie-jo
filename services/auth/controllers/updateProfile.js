const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');
const { logger } = require('../services');

const prisma = new PrismaClient();

const updateProfile = async (req, res) => {
  try {
    const { firstName, lastName, email, password, birthDate } = req.body;
    const data = {};

    if (firstName) data.firstName = firstName;
    if (lastName) data.lastName = lastName;
    if (email) data.email = email.toLowerCase().trim();
    if (password) data.hash = await bcrypt.hash(password, 10);
    if (birthDate) data.birthDate = new Date(birthDate);

    const updatedUser = await prisma.user.update({
      where: { id: req.user.userId },
      data
    });

    logger.info(`Profile updated for userId=${req.user.userId}`);
    res.status(200).json({ message: 'Profile updated.', user: updatedUser });
  } catch (err) {
    logger.error(`Error updating profile: ${err.message}`);
    res.status(500).json({ message: 'Internal server error.' });
  }
};

module.exports = { updateProfile };
