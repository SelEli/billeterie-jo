const { prisma, logger, safePublish, validateId } = require('./core.service');

// CREATE ROLE
async function createRoleService({ userId, role }) {
  logger.debug(`[ROLE][CREATE] Assigning role ${role} to user ${userId}`);

  const parsedId = validateId(userId, 'ROLE.CREATE');
  if (!parsedId) return { error: 'INVALID_ROLE_ID' };
  if (!role) return { error: 'ROLE_REQUIRED' };

  const validRoles = ['ADMIN', 'AGENT', 'USER', 'VISITOR', 'EMPLOYEE'];
  if (typeof role === 'string' && !validRoles.includes(role.toUpperCase())) {
    return { error: 'INVALID_ROLE' };
  }

  const existingUser = await prisma.user.findUnique({ where: { id: parsedId } });
  if (!existingUser) return { error: 'USER_NOT_FOUND' };

  let updated;
  try {
    updated = await prisma.user.update({
      where: { id: parsedId },
      data: { role: role.toUpperCase() }
    });
  } catch (err) {
    if (err.message?.includes('Invalid enum value')) return { error: 'INVALID_ROLE' };
    if (err.message?.includes('Required')) return { error: 'ROLE_REQUIRED' };
    throw err;
  }

  await safePublish('user', {
    type: 'UserUpdated',
    userId: updated.id,
    email: updated.email,
    firstName: updated.firstName,
    lastName: updated.lastName,
    role: updated.role,
    invisibleKey: updated.invisibleKey
  }, 'ROLE.CREATE');

  return updated;
}

// DELETE ROLE
async function deleteRoleService(userId) {
  logger.debug(`[ROLE][DELETE] Resetting role for user id=${userId}`);

  const parsedId = validateId(userId, 'ROLE.DELETE');
  if (!parsedId) return { error: 'INVALID_ROLE_ID' };

  const existingUser = await prisma.user.findUnique({ where: { id: parsedId } });
  if (!existingUser) return null;

  const updated = await prisma.user.update({
    where: { id: parsedId },
    data: { role: 'VISITOR' }
  });

  await safePublish('user', {
    type: 'UserUpdated',
    userId: updated.id,
    email: updated.email,
    firstName: updated.firstName,
    lastName: updated.lastName,
    role: updated.role,
    invisibleKey: updated.invisibleKey
  }, 'ROLE.DELETE');

  return updated;
}

// GET ROLE
async function getRoleService(userId) {
  logger.debug(`[ROLE][GET] Fetching role for user id=${userId}`);

  const parsedId = validateId(userId, 'ROLE.GET');
  if (!parsedId) return { error: 'INVALID_ROLE_ID' };

  const user = await prisma.user.findUnique({
    where: { id: parsedId },
    select: { role: true }
  });

  if (!user) return null;
  return { id: parsedId, role: user.role };
}

// LIST ROLES
async function listRolesService() {
  logger.debug('[ROLE][LIST] Listing distinct roles from users');

  const roles = await prisma.user.findMany({
    distinct: ['role'],
    select: { role: true }
  });

  if (!roles || roles.length === 0) return { error: 'NO_ROLES_FOUND' };
  return roles.map(r => r.role);
}

// UPDATE ROLE
async function updateRoleService(userId, newRole) {
  logger.debug(`[ROLE][UPDATE] Updating role for user id=${userId}`);

  const parsedId = validateId(userId, 'ROLE.UPDATE');
  if (!parsedId) return { error: 'INVALID_ROLE_ID' };
  if (!newRole) return { error: 'ROLE_REQUIRED' };

  const validRoles = ['ADMIN', 'AGENT', 'USER', 'VISITOR', 'EMPLOYEE'];
  if (typeof newRole === 'string' && !validRoles.includes(newRole.toUpperCase())) {
    return { error: 'INVALID_ROLE' };
  }

  const existingUser = await prisma.user.findUnique({ where: { id: parsedId } });
  if (!existingUser) return null;

  let updated;
  try {
    updated = await prisma.user.update({
      where: { id: parsedId },
      data: { role: newRole.toUpperCase() }
    });
  } catch (err) {
    if (err.message?.includes('Invalid enum value')) return { error: 'INVALID_ROLE' };
    if (err.message?.includes('Required')) return { error: 'ROLE_REQUIRED' };
    throw err;
  }

  await safePublish('user', {
    type: 'UserUpdated',
    userId: updated.id,
    email: updated.email,
    firstName: updated.firstName,
    lastName: updated.lastName,
    role: updated.role,
    invisibleKey: updated.invisibleKey
  }, 'ROLE.UPDATE');

  return updated;
}

module.exports = {
  createRoleService,
  deleteRoleService,
  getRoleService,
  listRolesService,
  updateRoleService
};
