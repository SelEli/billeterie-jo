const { prisma, logger } = require('../../utils');
const { success, error } = require('../../utils/response');
const bcrypt = require('bcrypt');

const updateProfileController = async (req, res) => {
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
    return res.status(200).json(success({ message: 'Profile updated.', user: updatedUser }));
  } catch (err) {
    logger.error(`Error updating profile: ${err.message}`);
    return res.status(500).json(error(['Internal server error.']));
  }
};

module.exports = { updateProfileController };
