const bcrypt = require('bcrypt');
const {
  prisma, logger, generateInvisibleKey,
  USER_SELECT, normalizeEmail, toDateSafe,
  validateId, safePublish, makeDelete, makeRead, makeList,
  encryptInvisibleKey
} = require('./core.service');

// CREATE
async function createUserService(data) {
  if (!data?.email) return { error: 'EMAIL_REQUIRED' };
  if (!data?.password) return { error: 'PASSWORD_REQUIRED' };

  const email = normalizeEmail(data.email);
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) return { error: 'EMAIL_ALREADY_USED' };

  const hash = await bcrypt.hash(data.password, 10);
  let user;
  try {
    user = await prisma.user.create({
      data: {
        email,
        hash,
        firstName: data.firstName?.trim() || null,
        lastName: data.lastName?.trim() || null,
        birthDate: toDateSafe(data.birthDate),
        role: 'VISITOR',
        invisibleKey: encryptInvisibleKey(generateInvisibleKey()) // 🔒 chiffrée
      },
      select: USER_SELECT
    });
  } catch (err) {
    if (err.code === 'P2002') return { error: 'EMAIL_ALREADY_USED' };
    logger.error('[SECURITY][USER][CREATE] Prisma error', { error: err.message });
    return { error: 'INTERNAL_SERVER_ERROR' };
  }

  logger.info(`[SECURITY][USER][CREATE] User created [id=${user.id}]`);
  await safePublish('user', { type: 'UserCreated', userId: user.id, email: user.email }, 'USER.CREATE');
  return user;
}

// READ
const readUserService = makeRead('USER.READ');

// UPDATE
async function updateUserService(id, data) {
  const userId = validateId(id, 'USER.UPDATE');
  if (!userId) return { error: 'INVALID_USER_ID' };
  if (!data || typeof data !== 'object' || Object.keys(data).length === 0) {
    return { error: 'MISSING_REQUIRED_FIELDS' };
  }

  const safeData = {};
  if (data.email) safeData.email = normalizeEmail(data.email);
  if (data.firstName) safeData.firstName = data.firstName.trim();
  if (data.lastName) safeData.lastName = data.lastName.trim();
  if (data.birthDate) safeData.birthDate = toDateSafe(data.birthDate);

  let updated;
  try {
    updated = await prisma.user.update({ where: { id: userId }, data: safeData, select: USER_SELECT });
  } catch (err) {
    if (err.code === 'P2002') return { error: 'EMAIL_ALREADY_USED' };
    logger.error('[SECURITY][USER][UPDATE] Prisma error', { error: err.message });
    return { error: 'INTERNAL_SERVER_ERROR' };
  }

  logger.info(`[SECURITY][USER][UPDATE] User updated [id=${updated.id}]`);
  await safePublish('user', { type: 'UserUpdated', userId: updated.id }, 'USER.UPDATE');
  return updated;
}

// DELETE
const deleteUserService = makeDelete('USER.DELETE', 'UserDeleted');

// LIST
const listUsersService = makeList('USER.LIST', USER_SELECT);

module.exports = {
  createUserService,
  readUserService,
  updateUserService,
  deleteUserService,
  listUsersService
};
