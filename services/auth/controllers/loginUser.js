const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { z } = require('zod');
const { logger, publishKafkaEvent, generateInvisibleKey } = require('../services');

const prisma = new PrismaClient();
const TOKEN_EXPIRATION = '1h';


// Zod schema inline
const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8)
});

const loginUser = async (req, res) => {
  try {
    const { email, password } = loginSchema.parse(req.body);
    const emailClean = email.toLowerCase().trim();

    const user = await prisma.user.findUnique({ where: { email: emailClean } });
    if (!user) {
      logger.warn(`Login failed: user not found [${emailClean}]`);
      return res.status(404).json({ message: 'User not found.' });
    }

    const valid = await bcrypt.compare(password, user.hash || '');
    if (!valid) {
      logger.warn(`Login failed: invalid password for [${emailClean}]`);
      return res.status(401).json({ message: 'Invalid password.' });
    }

    const token = jwt.sign({
      userId: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role
    }, process.env.JWT_SECRET, { expiresIn: TOKEN_EXPIRATION });

    logger.info(`User logged in: ${user.email}`);
    await publishKafkaEvent('user.logged_in', { userId: user.id });

    res.status(200).json({ user, token });
  } catch (err) {
    logger.error(`Login error: ${err.message}`);
    res.status(400).json({ message: 'Invalid login payload.' });
  }
};

module.exports = { loginUser };
