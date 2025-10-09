const logger = require('../../utils/logger');
const monitor = require('../../monitor/monitor');
const { EventCreateSchema } = require('../../schemas/event.schema');
const { createEventService } = require('../../services/event/createEvent.service');
const { sendBusinessError } = require('../../utils/sendError');
const { sendBusinessSuccess } = require('../../utils/sendSuccess');
const { ERROR_STATUS } = require('../../utils/httpErrorMap');

async function createEventController(req, res) {
  logger.debug('[EVENT CONTROLLER] Requête création event reçue', {
    user: req.user,
    body: req.body
  });

  if (!req.user || !['ADMIN', 'AGENT'].includes(req.user.role)) {
    logger.warn('[EVENT CONTROLLER] Accès refusé', { user: req.user });
    return sendBusinessError(res, 'FORBIDDEN');
  }

  // Validation Zod
  let parsed;
  try {
    parsed = EventCreateSchema.parse(req.body);
    logger.debug('[EVENT CONTROLLER] Validation réussie', parsed);
  } catch (err) {
    logger.warn('[EVENT CONTROLLER] Validation échouée', {
      issues: err.issues?.map(i => ({
        path: i.path,
        message: i.message
      }))
    });
    return sendBusinessError(
      res,
      'INVALID_EVENT_DATA',
      err.issues?.map(i => i.message)
    );
  }

  // Nettoyage payload
  const { id, ...safePayload } = parsed;

  const timer = monitor.timer('event_create').start();
  try {
    logger.debug('[EVENT CONTROLLER] Appel service createEventService', safePayload);
    const event = await createEventService(safePayload);

    timer.stop();
    logger.info('[EVENT CONTROLLER] Event créé avec succès', { eventId: event.id });

    return sendBusinessSuccess(res, 'CREATE_EVENT', { eventId: event.id }, {
      message: 'Event created successfully'
    });
  } catch (error) {
    timer.stop();
    logger.error('[EVENT CONTROLLER] Erreur création event', {
      error: error.message,
      stack: error.stack
    });
    const code =
      error.message && ERROR_STATUS && ERROR_STATUS[error.message]
        ? error.message
        : 'INTERNAL_SERVER_ERROR';
    return sendBusinessError(res, code);
  }
}

module.exports = { createEventController };
