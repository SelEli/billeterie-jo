const { prisma, logger, publishKafkaEvent, generateInvisibleKey } = require('../../utils');
const { success, error } = require('../../utils/response');
const bcrypt = require('bcrypt');

const createUserController = async (req, res) => {
  try {
    const { firstName, lastName, email, password, birthDate, role } = req.body;
    const emailClean = email.toLowerCase().trim();

    const existing = await prisma.user.findUnique({ where: { email: emailClean } });
    if (existing) {
      logger.warn(`Attempt to create user with existing email: ${emailClean}`);
      return res.status(409).json(error(['Email already used.']));
    }

    const hash = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        firstName,
        lastName,
        email: emailClean,
        hash,
        birthDate: new Date(birthDate),
        invisibleKey: generateInvisibleKey(),
        role
      }
    });

    logger.info(`User created [${role}]: ${user.email}`);
    await publishKafkaEvent('user.created', { userId: user.id, role: user.role });

    return res.status(201).json(success(user));
  } catch (err) {
    logger.error(`Error creating user: ${err.message}`);
    return res.status(500).json(error(['Internal server error.']));
  }
};

module.exports = { createUserController };
