const { prisma, logger, publishKafkaEvent, generateInvisibleKey } = require('../utils');

const USER_SELECT = {
  id: true, email: true, firstName: true, lastName: true,
  birthDate: true, role: true, invisibleKey: true,
  lastLogin: true, isBlacklisted: true, blacklistReason: true,
  createdAt: true, updatedAt: true
};

const normalizeEmail = (email) => String(email || '').trim().toLowerCase();
const toDateSafe = (date) => (date ? new Date(date) : null);

const validateId = (id, ctx) => {
  const parsed = Number(id);
  if (!Number.isInteger(parsed) || parsed <= 0) {
    logger.warn(`[${ctx}] Invalid ID: ${id}`);
    return null;
  }
  return parsed;
};

const safePublish = async (topic, payload, ctx) => {
  try {
    await publishKafkaEvent(topic, payload);
    logger.debug(`[${ctx}] Kafka published`);
  } catch (err) {
    logger.warn(`[${ctx}] Kafka skipped: ${err.message}`);
  }
};

const makeDelete = (ctx, eventType) => async (id) => {
  const parsed = validateId(id, ctx);
  if (!parsed) return { error: 'INVALID_USER_ID' };
  const existing = await prisma.user.findUnique({ where: { id: parsed } });
  if (!existing) return null;
  await prisma.user.delete({ where: { id: parsed } });
  logger.info(`[${ctx}] Deleted [id=${parsed}]`);
  await safePublish('user', { type: eventType, userId: parsed }, ctx);
  return true;
};

const makeRead = (ctx) => async (id) => {
  const parsed = validateId(id, ctx);
  if (!parsed) return { error: 'INVALID_USER_ID' };
  const user = await prisma.user.findUnique({ where: { id: parsed }, select: USER_SELECT });
  if (!user) {
    logger.warn(`[${ctx}] Not found [id=${parsed}]`);
    return null;
  }
  logger.info(`[${ctx}] Found [id=${user.id}]`);
  return user;
};

// 🔥 Ajout de makeList
const makeList = (ctx, select) => async (filters = {}) => {
  const where = {};
  if (filters.email) {
    where.email = { contains: String(filters.email).trim().toLowerCase(), mode: 'insensitive' };
  }
  if (filters.role) where.role = filters.role;

  const limit = Number(filters.limit) > 0 ? Number(filters.limit) : 10;
  const page = Number(filters.page) > 0 ? Number(filters.page) : 1;
  const skip = (page - 1) * limit;

  let orderBy = { id: 'asc' };
  if (filters.sortBy) {
    orderBy = { [filters.sortBy]: filters.order?.toLowerCase() === 'desc' ? 'desc' : 'asc' };
  }

  const [users, total] = await Promise.all([
    prisma.user.findMany({ where, orderBy, take: limit, skip, select }),
    prisma.user.count({ where })
  ]);

  logger.info(`[${ctx}] Retrieved ${users.length} user(s) on page ${page}`);
  return { users, pagination: { page, limit, total } };
};

module.exports = {
  prisma, logger, generateInvisibleKey,
  USER_SELECT, normalizeEmail, toDateSafe,
  validateId, safePublish, makeDelete, makeRead, makeList // ✅ on exporte makeList
};
