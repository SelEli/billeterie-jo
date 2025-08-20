const { prisma, logger, publishKafkaEvent } = require('../../utils');
const { success, error } = require('../../utils/response');

const updateUserRoleController = async (req, res) => {
  try {
    const userId = parseInt(req.params.id, 10);
    if (isNaN(userId)) {
      logger.warn(`Invalid user ID: ${req.params.id}`);
      return res.status(400).json(error(['Invalid user ID.']));
    }

    const { role } = req.body;
    if (!role) {
      logger.warn(`Role not provided for user update [id=${userId}]`);
      return res.status(400).json(error(['Role is required.']));
    }

    const normalizedRole = role.toUpperCase();
    const validRoles = ['ADMIN', 'AGENT', 'USER', 'VISITOR'];
    if (!validRoles.includes(normalizedRole)) {
      logger.warn(`Invalid role assignment attempted: ${role}`);
      return res.status(400).json(error(['Invalid target role.']));
    }

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      logger.warn(`User not found for role update [id=${userId}]`);
      return res.status(404).json(error(['User not found.']));
    }

    if (user.role === 'VISITOR' && normalizedRole !== 'USER') {
      logger.warn(`Visitor role cannot be elevated beyond user [id=${userId}]`);
      return res.status(403).json(error(['Visitors cannot be reassigned beyond user.']));
    }

    const updated = await prisma.user.update({
      where: { id: userId },
      data: { role: normalizedRole }
    });

    logger.info(`Role updated for user [id=${userId}] → ${normalizedRole}`);
    await publishKafkaEvent('user.role_updated', { userId, newRole: normalizedRole });

    return res.status(200).json(success({ message: 'Role updated.', user: updated }));
  } catch (err) {
    logger.error(`Error updating role: ${err.message}`);
    if (err.code === 'P2002') {
      return res.status(400).json(error(['Database constraint violation.']));
    }
    return res.status(500).json(error(['Internal server error.']));
  }
};

module.exports = { updateUserRoleController };
