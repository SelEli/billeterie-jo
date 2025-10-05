const { prisma, logger, safePublish, validateId } = require('./core.service');

// NEW: centralisation des rôles valides
const VALID_ROLES = ['ADMIN', 'AGENT', 'USER', 'VISITOR', 'EMPLOYEE'];

// CREATE ROLE
async function createRoleService({ userId, role }) {
  logger.debug(`[ROLE][CREATE] Assigning role ${role} to user ${userId}`);

  const parsedId = validateId(userId, 'ROLE.CREATE');
  if (!parsedId) return { error: 'INVALID_ROLE_ID' };
  if (!role) return { error: 'ROLE_REQUIRED' };

  // NEW: normalisation et validation robuste
  const roleValue = String(role).toUpperCase();
  if (!VALID_ROLES.includes(roleValue)) {
    return { error: 'INVALID_ROLE' };
  }

  const existingUser = await prisma.user.findUnique({ where: { id: parsedId } });
  if (!existingUser) return { error: 'USER_NOT_FOUND' }; // cohérent côté service

  let updated;
  try {
    updated = await prisma.user.update({
      where: { id: parsedId },
      data: { role: roleValue }
    });
  } catch (err) {
    // NEW: priorité au code Prisma si disponible
    if (err.code === 'P2003' || err.code === 'P2000') return { error: 'INVALID_ROLE' };
    if (err.code === 'P2002') return { error: 'INVALID_ROLE' };
    // fallback initial
    if (err.message?.includes('Invalid enum value')) return { error: 'INVALID_ROLE' };
    if (err.message?.includes('Required')) return { error: 'ROLE_REQUIRED' };
    throw err;
  }

  // NEW: audit explicite
  logger.info(`[ROLE][CREATE] User ${parsedId}: role set to ${roleValue}`);

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
  if (!existingUser) return null; // on garde le flow existant (NOT_FOUND via controller)

  const updated = await prisma.user.update({
    where: { id: parsedId },
    data: { role: 'VISITOR' }
  });

  // NEW: audit explicite
  logger.info(`[ROLE][DELETE] User ${parsedId}: role reset to VISITOR`);

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

  if (!user) return null; // on garde le flow existant (NOT_FOUND via controller)
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

  // NEW: normalisation + validation
  const roleValue = String(newRole).toUpperCase();
  if (!VALID_ROLES.includes(roleValue)) {
    return { error: 'INVALID_ROLE' };
  }

  const existingUser = await prisma.user.findUnique({ where: { id: parsedId } });
  if (!existingUser) return null; // on garde le flow existant (NOT_FOUND via controller)

  const oldRole = existingUser.role;
  let updated;
  try {
    updated = await prisma.user.update({
      where: { id: parsedId },
      data: { role: roleValue }
    });
  } catch (err) {
    // NEW: priorité au code Prisma si disponible
    if (err.code === 'P2003' || err.code === 'P2000') return { error: 'INVALID_ROLE' };
    if (err.code === 'P2002') return { error: 'INVALID_ROLE' };
    // fallback initial
    if (err.message?.includes('Invalid enum value')) return { error: 'INVALID_ROLE' };
    if (err.message?.includes('Required')) return { error: 'ROLE_REQUIRED' };
    throw err;
  }

  // NEW: audit explicite transition
  logger.info(`[ROLE][UPDATE] User ${parsedId}: ${oldRole} → ${roleValue}`);

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
