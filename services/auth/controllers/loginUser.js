const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { z } = require('zod');
const { logger, publishKafkaEvent } = require('../services');

const prisma = new PrismaClient();
const TOKEN_EXPIRATION = '1h';

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8)
});

const loginUser = async (req, res) => {
  try {
    const { email, password } = loginSchema.parse(req.body);
    const emailClean = email.toLowerCase().trim();

    // Vérifier si l'utilisateur existe
    const user = await prisma.user.findUnique({ where: { email: emailClean } });
    if (!user) {
      logger.warn(`Login failed: user not found [${emailClean}]`);
      return res.status(404).json({ message: 'User not found.' });
    }

    // Vérifier si l'utilisateur est blacklisted
    if (user.isBlacklisted) {
      logger.warn(`Login blocked: blacklisted user [${user.email}]`);
      return res.status(403).json({ message: 'Access denied — user is blacklisted.' });
    }

    // Vérifier le mot de passe
    const valid = await bcrypt.compare(password, user.hash || '');
    if (!valid) {
      logger.warn(`Login failed: invalid password for [${emailClean}]`);
      return res.status(401).json({ message: 'Invalid password.' });
    }

    // Créer le token
    const token = jwt.sign({
      userId: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role.toUpperCase(),
      invisibleKey: user.invisibleKey
    }, process.env.JWT_SECRET, { expiresIn: TOKEN_EXPIRATION });

    // Mettre à jour le dernier login de l'utilisateur
    await prisma.user.update({
      where: { id: user.id },
      data: { lastLogin: new Date() }
    });

    // Log l'événement dans Kafka
    logger.info(`User logged in: ${user.email}`);
    await publishKafkaEvent('user.logged_in', { userId: user.id, role: user.role.toUpperCase() });

    res.status(200).json({ user, token });
  } catch (err) {
    logger.error(`Login error: ${err.message}`);
    if (err instanceof z.ZodError) {
      return res.status(400).json({ message: 'Invalid login payload.' });
    }
    res.status(500).json({ message: 'Login failed. Please try again.' });
  }
};

module.exports = { loginUser };
