const { logger, sendBusinessError, sendBusinessSuccess, ERROR_STATUS } = require('../../utils');
const monitor = require('../../monitor/monitor');
const { createEventService } = require('../../services/event/createEvent.service');


async function createEventController(req, res) {
  logger.debug('[EVENT CONTROLLER] Requête création event reçue', {
    user: req.user,
    body: req.body
  });

  if (!req.user || !['ADMIN', 'AGENT'].includes(req.user.role)) {
    logger.warn('[EVENT CONTROLLER] Accès refusé', { user: req.user });
    return sendBusinessError(res, 'FORBIDDEN');
  }

  // ✅ Données déjà validées et transformées par le middleware
  const { id, ...safePayload } = req.validated;

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
