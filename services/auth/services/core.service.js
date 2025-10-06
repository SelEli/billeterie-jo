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
    logger.warn(`[SECURITY][${ctx}] Invalid ID: ${id}`);
    return null;
  }
  return parsed;
};

// Masquage des payloads sensibles
const sanitizePayload = (payload) => {
  if (!payload || typeof payload !== 'object') return payload;
  const clone = { ...payload };
  if (clone.password) clone.password = '***';
  if (clone.token) clone.token = '***';
  if (clone.refreshToken) clone.refreshToken = '***';
  if (clone.invisibleKey) clone.invisibleKey = '***';
  return clone;
};

const safePublish = async (topic, payload, ctx) => {
  try {
    await publishKafkaEvent(topic, payload);
    logger.info(`[SECURITY][${ctx}] Kafka published`, { topic });
  } catch (err) {
    logger.error(`[SECURITY][${ctx}] Kafka publish failed`, {
      topic,
      error: err.message,
      payload: sanitizePayload(payload)
    });
  }
};

const makeDelete = (ctx, eventType) => async (id) => {
  const parsed = validateId(id, ctx);
  if (!parsed) return { error: 'INVALID_USER_ID' };
  const existing = await prisma.user.findUnique({ where: { id: parsed } });
  if (!existing) return null;
  await prisma.user.delete({ where: { id: parsed } });
  logger.info(`[SECURITY][${ctx}] Deleted [id=${parsed}]`);
  await safePublish('user', { type: eventType, userId: parsed }, ctx);
  return true;
};

const makeRead = (ctx) => async (id) => {
  const parsed = validateId(id, ctx);
  if (!parsed) return { error: 'INVALID_USER_ID' };
  const user = await prisma.user.findUnique({ where: { id: parsed }, select: USER_SELECT });
  if (!user) {
    logger.warn(`[SECURITY][${ctx}] Not found [id=${parsed}]`);
    return null;
  }
  logger.info(`[SECURITY][${ctx}] Found [id=${user.id}]`);
  return user;
};

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

  logger.info(`[SECURITY][${ctx}] Retrieved ${users.length} user(s)`, {
    pagination: { page, limit, total }
  });
  return { users, pagination: { page, limit, total } };
};

module.exports = {
  prisma, logger, generateInvisibleKey,
  USER_SELECT, normalizeEmail, toDateSafe,
  validateId, safePublish, makeDelete, makeRead, makeList
};
