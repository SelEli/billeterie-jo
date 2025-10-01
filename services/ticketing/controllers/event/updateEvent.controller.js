const logger  = require('../../utils/logger');
const monitor = require('../../monitor/monitor');
const { EventUpdateSchema } = require('../../schemas/event.schema');
const { updateEventService } = require('../../services/event/updateEvent.service');
const { sendBusinessError } = require('../../utils/sendError');
const { sendBusinessSuccess } = require('../../utils/sendSuccess');
const { ERROR_STATUS } = require('../../utils/httpErrorMap');

async function updateEventController(req, res) {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id <= 0) {
    return sendBusinessError(res, 'INVALID_EVENT_ID');
  }

  if (!req.user || req.user.role !== 'ADMIN') {
    return sendBusinessError(res, 'FORBIDDEN');
  }

  let parsed;
  try {
    parsed = EventUpdateSchema.parse(req.body);
  } catch (err) {
    logger.warn('[EVENT CONTROLLER] Validation échouée', { issues: err.issues });
    return sendBusinessError(res, 'INVALID_EVENT_DATA', err.issues?.map(i => i.message));
  }

  const { id: ignored, ...safePayload } = parsed;

  const timer = monitor.timer('event_update').start();
  try {
    const event = await updateEventService(id, safePayload);
    timer.stop();

    if (!event) {
      return sendBusinessError(res, 'EVENT_NOT_FOUND');
    }

    logger.info('[EVENT CONTROLLER] Event mis à jour', { eventId: id });
    return sendBusinessSuccess(res, 'UPDATE_EVENT', event, { message: 'Event updated successfully' });
  } catch (error) {
    timer.stop();
    logger.error('[EVENT CONTROLLER] Erreur update event', { error: error.message });
    const code = error.message && error.message in ERROR_STATUS
      ? error.message
      : 'INTERNAL_SERVER_ERROR';
    return sendBusinessError(res, code);
  }
}

module.exports = { updateEventController };
