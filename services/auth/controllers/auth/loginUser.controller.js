const { prisma, logger, publishKafkaEvent } = require('../../utils');
const { success, error } = require('../../utils/response');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { z } = require('zod');

const TOKEN_EXPIRATION = '1h';

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8)
});

const loginUserController = async (req, res) => {
  try {
    const { email, password } = loginSchema.parse(req.body);
    const emailClean = email.toLowerCase().trim();

    const user = await prisma.user.findUnique({ where: { email: emailClean } });
    if (!user) {
      logger.warn(`Login failed: user not found [${emailClean}]`);
      return res.status(404).json(error(['User not found.']));
    }

    if (user.isBlacklisted) {
      logger.warn(`Login blocked: blacklisted user [${user.email}]`);
      return res.status(403).json(error(['Access denied — user is blacklisted.']));
    }

    const valid = await bcrypt.compare(password, user.hash || '');
    if (!valid) {
      logger.warn(`Login failed: invalid password for [${emailClean}]`);
      return res.status(401).json(error(['Invalid password.']));
    }

    const token = jwt.sign({
      userId: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role.toUpperCase(),
      invisibleKey: user.invisibleKey
    }, process.env.JWT_SECRET, { expiresIn: TOKEN_EXPIRATION });

    await prisma.user.update({
      where: { id: user.id },
      data: { lastLogin: new Date() }
    });

    logger.info(`User logged in: ${user.email}`);
    await publishKafkaEvent('user.logged_in', { userId: user.id, role: user.role.toUpperCase() });

    return res.status(200).json(success({ user, token }));
  } catch (err) {
    logger.error(`Login error: ${err.message}`);
    if (err instanceof z.ZodError) {
      return res.status(400).json(error(['Invalid login payload.']));
    }
    return res.status(500).json(error(['Login failed. Please try again.']));
  }
};

module.exports = { loginUserController };
