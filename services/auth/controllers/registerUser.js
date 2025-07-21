const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { logger, publishKafkaEvent, generateInvisibleKey } = require('../services');

const prisma = new PrismaClient();
const TOKEN_EXPIRATION = '1h';

const registerUser = async (req, res) => {
  try {
    const { firstName, lastName, email, password, birthDate } = req.body;
    const emailClean = email.toLowerCase().trim();

    const existing = await prisma.user.findUnique({ where: { email: emailClean } });
    if (existing) {
      return res.status(409).json({ message: 'Email already registered.' });
    }

    const hash = await bcrypt.hash(password, 10);
    const key = generateInvisibleKey();

    const user = await prisma.user.create({
      data: {
        firstName,
        lastName,
        email: emailClean,
        hash,
        birthDate: new Date(birthDate),
        invisibleKey: key,
        role: 'visitor',
        lastLogin: null,
        isBlacklisted: false,
        blacklistReason: null
      }
    });

    const token = jwt.sign({
      userId: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
      invisibleKey: user.invisibleKey
    }, process.env.JWT_SECRET, { expiresIn: TOKEN_EXPIRATION });

    logger.info(`User registered: ${user.email}`);
    await publishKafkaEvent('user.created', {
      userId: user.id,
      role: user.role,
      invisibleKey: user.invisibleKey
    });

    res.status(201).json({ user, token });
  } catch (err) {
    logger.error(`Registration error: ${err.message}`);
    res.status(400).json({ message: 'Registration failed.' });
  }
};

module.exports = { registerUser };
