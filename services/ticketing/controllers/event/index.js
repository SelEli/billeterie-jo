// controllers/event/index.js
const createEventController = require('./createEvent.controller');
const readEventController   = require('./readEvent.controller');
const listEventsController  = require('./listEvents.controller');
const updateEventController = require('./updateEvent.controller');
const deleteEventController = require('./deleteEvent.controller');
const logger = require('../../utils/logger');

// Vérification stricte dès le chargement
[
  ['createEventController', createEventController],
  ['readEventController', readEventController],
  ['listEventsController', listEventsController],
  ['updateEventController', updateEventController],
  ['deleteEventController', deleteEventController]
].forEach(([name, fn]) => {
  if (typeof fn !== 'function') {
    logger.error(`❌ Contrôleur ${name} est undefined ou mal exporté`);
    throw new Error(`❌ Contrôleur ${name} est undefined ou mal exporté`);
  }
  logger.debug(`✅ Contrôleur ${name} chargé`);
});

module.exports = {
  createEventController,
  readEventController,
  listEventsController,
  updateEventController,
  deleteEventController
};
