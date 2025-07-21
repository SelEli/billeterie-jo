const { PrismaClient } = require('@prisma/client');
const { logger, publishKafkaEvent } = require('../services');

const prisma = new PrismaClient();

// Fonction de mise à jour du rôle d'un utilisateur
const updateUserRole = async (req, res) => {
  try {
    // Extraction et validation de l'ID utilisateur depuis les paramètres de la requête
    const userId = parseInt(req.params.id, 10);
    if (isNaN(userId)) {
      logger.warn(`Invalid user ID: ${req.params.id}`);
      return res.status(400).json({ message: 'Invalid user ID.' });
    }

    // Vérification si le rôle est fourni dans le corps de la requête
    if (!req.body.role) {
      logger.warn(`Role not provided for user update [id=${userId}]`);
      return res.status(400).json({ message: 'Role is required.' });
    }

    // Normalisation du rôle en majuscules pour assurer la cohérence
    const role = req.body.role.toUpperCase();  // Correction pour normaliser en majuscules

    // Liste des rôles autorisés en majuscules
    const validRoles = ['ADMIN', 'AGENT', 'USER', 'VISITOR'];

    // Vérification si le rôle est valide
    if (!validRoles.includes(role)) {
      logger.warn(`Invalid role assignment attempted: ${req.body.role}`);
      return res.status(400).json({ message: 'Invalid target role.' });
    }

    // Recherche de l'utilisateur dans la base de données par ID
    const user = await prisma.user.findUnique({ where: { id: userId } });
    
    if (!user) {
      logger.warn(`User not found for role update [id=${userId}]`);
      return res.status(404).json({ message: 'User not found.' });
    }

    // Empêcher la mise à jour d'un rôle de "VISITOR" au-delà de "USER"
    if (user.role === 'VISITOR' && role !== 'USER') {
      logger.warn(`Visitor role cannot be elevated beyond user [id=${userId}]`);
      return res.status(403).json({ message: 'Visitors cannot be reassigned beyond user.' });
    }

    // Mise à jour du rôle de l'utilisateur dans la base de données
    const updated = await prisma.user.update({
      where: { id: userId },
      data: { role }
    });

    // Log de la mise à jour réussie
    logger.info(`Role updated for user [id=${userId}] → ${role}`);

    // Envoi de l'événement Kafka avec le rôle en majuscule pour garantir uniformité
    await publishKafkaEvent('user.role_updated', {
      userId: userId,
      newRole: role  // Role déjà en majuscule
    });

    // Réponse à la requête avec l'utilisateur mis à jour
    return res.status(200).json({ message: 'Role updated.', user: updated });
    
  } catch (err) {
    // Log de l'erreur en cas de problème
    logger.error(`Error updating role: ${err.message}`);
    if (err.code === 'P2002') {  // Si Prisma renvoie une erreur liée à une violation de contrainte unique
      return res.status(400).json({ message: 'Database constraint violation.' });
    }
    return res.status(500).json({ message: 'Internal server error.' });
  }
};

module.exports = { updateUserRole };
