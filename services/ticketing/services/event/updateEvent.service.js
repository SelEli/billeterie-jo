const prisma = require('../../utils/prismaClient');
const { emitEventUpdated } = require('../../kafka/event.kafka');
const logger = require('../../utils/logger');
const { timer } = require('../../monitor/monitor');
const { cacheEvent } = require('../../cache/event.cache');
const { ERROR_STATUS } = require('../../utils/httpErrorMap');

async function updateEventService(id, data) {
  const t = timer('updateEventService').start();
  const eventId = Number(id);

  if (!Number.isInteger(eventId) || eventId <= 0) {
    const err = new Error('INVALID_EVENT_ID');
    err.statusCode = ERROR_STATUS.INVALID_EVENT_ID;
    throw err;
  }

  let updated;
  try {
    updated = await prisma.event.update({
      where: { id: eventId },
      data,
      include: { offers: true, tickets: true }
    });
  } catch {
    const err = new Error('EVENT_NOT_FOUND');
    err.statusCode = ERROR_STATUS.EVENT_NOT_FOUND;
    throw err;
  }

  logger.info(`[EVENT] Updated: ${updated.id}`);

  try {
    await emitEventUpdated({ id: updated.id, changes: data });
  } catch (emitErr) {
    logger.warn(`[EVENT] emitEventUpdated failed: ${emitErr.message}`);
  }

  try {
    await cacheEvent(updated);
  } catch (cacheErr) {
    logger.warn(`[EVENT] cacheEvent failed: ${cacheErr.message}`);
  }

  t.success();
  return updated;
}

module.exports = { updateEventService };
