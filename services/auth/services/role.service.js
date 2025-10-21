const { prisma, logger, safePublish, validateId } = require('./core.service');

const VALID_ROLES = ['ADMIN', 'AGENT', 'USER', 'VISITOR', 'EMPLOYEE'];

async function createRoleService({ userId, role }) {
  const parsedId = validateId(userId, 'ROLE.CREATE');
  if (!parsedId) return { error: 'INVALID_ROLE_ID' };
  if (!role) return { error: 'ROLE_REQUIRED' };

  const roleValue = String(role).toUpperCase();
  if (!VALID_ROLES.includes(roleValue)) return { error: 'INVALID_ROLE' };

  const existingUser = await prisma.user.findUnique({ where: { id: parsedId } });
  if (!existingUser) return { error: 'USER_NOT_FOUND' };

  let updated;
  try {
    updated = await prisma.user.update({
      where: { id: parsedId },
      data: { role: roleValue }
    });
  } catch {
    return { error: 'INVALID_ROLE' };
  }

  logger.info(`[SECURITY][ROLE][CREATE] User ${parsedId}: role set to ${roleValue}`);
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

async function deleteRoleService(userId) {
  const parsedId = validateId(userId, 'ROLE.DELETE');
  if (!parsedId) return { error: 'INVALID_ROLE_ID' };

  const existingUser = await prisma.user.findUnique({ where: { id: parsedId } });
  if (!existingUser) return null;

  const updated = await prisma.user.update({
    where: { id: parsedId },
    data: { role: 'VISITOR' }
  });

  logger.info(`[SECURITY][ROLE][DELETE] User ${parsedId}: role reset to VISITOR`);
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

async function getRoleService(userId) {
  const parsedId = validateId(userId, 'ROLE.GET');
  if (!parsedId) return { error: 'INVALID_ROLE_ID' };

  const user = await prisma.user.findUnique({
    where: { id: parsedId },
    select: { role: true }
  });

  if (!user) return null;
  return { id: parsedId, role: user.role };
}

async function listRolesService() {
  const roles = await prisma.user.findMany({
    distinct: ['role'],
    select: { role: true }
  });

  if (!roles || roles.length === 0) return { error: 'NO_ROLES_FOUND' };
  return roles.map(r => r.role);
}

async function updateRoleService(userId, newRole) {
  const parsedId = validateId(userId, 'ROLE.UPDATE');
  if (!parsedId) return { error: 'INVALID_ROLE_ID' };
  if (!newRole) return { error: 'ROLE_REQUIRED' };

  const roleValue = String(newRole).toUpperCase();
  if (!VALID_ROLES.includes(roleValue)) return { error: 'INVALID_ROLE' };

  const existingUser = await prisma.user.findUnique({ where: { id: parsedId } });
  if (!existingUser) return null;

  const oldRole = existingUser.role;
  let updated;
  try {
    updated = await prisma.user.update({
      where: { id: parsedId },
      data: { role: roleValue }
    });
  } catch {
    return { error: 'INVALID_ROLE' };
  }

  logger.info(`[SECURITY][ROLE][UPDATE] User ${parsedId}: ${oldRole} → ${roleValue}`);
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
