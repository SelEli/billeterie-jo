const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const { logger, publishKafkaEvent, generateInvisibleKey } = require('../services');


const prisma = new PrismaClient();


const createUser = async (req, res) => {
  try {
    const { firstName, lastName, email, password, birthDate, role } = req.body;
    const emailClean = email.toLowerCase().trim();

    const existing = await prisma.user.findUnique({ where: { email: emailClean } });
    if (existing) {
      logger.warn(`Attempt to create user with existing email: ${emailClean}`);
      return res.status(409).json({ message: 'Email already used.' });
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

    res.status(201).json({ message: 'User created.', user });
  } catch (err) {
    logger.error(`Error creating user: ${err.message}`);
    res.status(500).json({ message: 'Internal server error.' });
  }
};

module.exports = { createUser };
