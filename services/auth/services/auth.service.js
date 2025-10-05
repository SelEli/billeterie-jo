// services/auth.service.js
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const {
  prisma, logger, generateInvisibleKey,
  USER_SELECT, normalizeEmail, toDateSafe,
  validateId, safePublish, makeDelete, makeRead
} = require('./core.service');

const TOKEN_EXPIRATION = '1h';

// REGISTER
async function registerUserService({ firstName, lastName, email, password, birthDate }) {
  logger.debug('[AUTH][REGISTER] Tentative enregistrement', { email });
  if (!email || !password || !firstName || !lastName || !birthDate) {
    return { error: 'MISSING_REQUIRED_FIELDS' };
  }

  const emailClean = normalizeEmail(email);
  const existing = await prisma.user.findUnique({ where: { email: emailClean } });
  if (existing) return { error: 'EMAIL_ALREADY_USED' };

  const hash = await bcrypt.hash(password, 10);
  let user;
  try {
    user = await prisma.user.create({
      data: {
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        email: emailClean,
        hash,
        birthDate: toDateSafe(birthDate),
        invisibleKey: generateInvisibleKey(),
        role: 'VISITOR',
        lastLogin: null,
        isBlacklisted: false,
        blacklistReason: null
      },
      select: USER_SELECT
    });
  } catch (err) {
    if (err.code === 'P2002') return { error: 'EMAIL_ALREADY_USED' };
    logger.error('[AUTH][REGISTER] Prisma error:', err);
    return { error: 'INTERNAL_SERVER_ERROR' };
  }

  const secret = process.env.JWT_SECRET;
  if (!secret || secret.length < 32) return { error: 'SERVER_MISCONFIGURATION' };

  let token;
  try {
    token = jwt.sign(
      { userId: user.id, firstName: user.firstName, lastName: user.lastName, role: user.role },
      secret,
      { expiresIn: TOKEN_EXPIRATION }
    );
  } catch {
    return { error: 'TOKEN_GENERATION_FAILED' };
  }

  logger.info(`[AUTH][REGISTER] User registered: ${user.email} (id=${user.id})`);
  await safePublish('user', {
    type: 'UserCreated',
    userId: user.id,
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
    role: user.role,
    invisibleKey: user.invisibleKey
  }, 'AUTH.REGISTER');

  return { ...user, token };
}

// LOGIN
async function loginService({ email, password }) {
  logger.debug('[AUTH][LOGIN] Tentative connexion');
  if (!email || !password) return { error: 'MISSING_CREDENTIALS' };

  const emailClean = normalizeEmail(email);
  const user = await prisma.user.findUnique({ where: { email: emailClean } });
  if (!user) return { error: 'USER_NOT_FOUND' };

  const isValid = await bcrypt.compare(password, user.hash);
  if (!isValid) return { error: 'INVALID_PASSWORD' };

  const secret = process.env.JWT_SECRET;
  if (!secret || secret.length < 32) return { error: 'SERVER_MISCONFIGURATION' };

  let token;
  try {
    token = jwt.sign(
      { userId: user.id, firstName: user.firstName, lastName: user.lastName, role: user.role },
      secret,
      { expiresIn: TOKEN_EXPIRATION }
    );
  } catch {
    return { error: 'TOKEN_GENERATION_FAILED' };
  }

  logger.info(`[AUTH][LOGIN] Connexion réussie: ${user.email}`);
  return { ...user, token };
}

// GET PROFILE / DELETE PROFILE via core patterns
const getProfileService = makeRead('AUTH.GET_PROFILE');
const deleteProfileService = makeDelete('AUTH.DELETE_PROFILE', 'UserDeleted');

// UPDATE PROFILE
async function updateProfileService(userId, payload) {
  const parsed = validateId(userId, 'AUTH.UPDATE_PROFILE');
  if (!parsed) return { error: 'INVALID_USER_ID' };

  if (payload.birthDate) payload.birthDate = toDateSafe(payload.birthDate);

  const updated = await prisma.user.update({ where: { id: parsed }, data: payload, select: USER_SELECT });
  logger.info(`[AUTH][UPDATE_PROFILE] Updated [id=${parsed}]`);

  await safePublish('user', {
    type: 'UserUpdated',
    userId: updated.id,
    email: updated.email,
    firstName: updated.firstName,
    lastName: updated.lastName,
    role: updated.role,
    invisibleKey: updated.invisibleKey
  }, 'AUTH.UPDATE_PROFILE');

  return updated;
}

// LOGOUT
async function logoutService(user) {
  const userId = validateId(user?.id, 'AUTH.LOGOUT');
  if (!userId) return { error: 'INVALID_USER_ID' };

  logger.info(`[AUTH][LOGOUT] User ${userId} logged out`);
  await safePublish('user.logged_out', { userId }, 'AUTH.LOGOUT');
  return true;
}

module.exports = {
  registerUserService,
  loginService,
  getProfileService,
  updateProfileService,
  deleteProfileService,
  logoutService
};
