const { PrismaClient } = require('@prisma/client');
const { logger, publishKafkaEvent, generateInvisibleKey } = require('../services');

const prisma = new PrismaClient();


const updateUserRole = async (req, res) => {
  const userId = parseInt(req.params.id);
  const { role } = req.body;

  if (!['admin', 'employee'].includes(role)) {
    return res.status(400).json({ message: 'Invalid target role.' });
  }

  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) return res.status(404).json({ message: 'User not found.' });
  if (user.role === 'visitor') {
    return res.status(403).json({ message: 'Visitors cannot be reassigned.' });
  }

  const updated = await prisma.user.update({
    where: { id: userId },
    data: { role }
  });

  res.status(200).json({ message: 'Role updated.', user: updated });
};

module.exports = { updateUserRole };
