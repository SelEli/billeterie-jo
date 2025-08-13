const createEventController = require('./createEvent.controller');
const readEventController   = require('./readEvent.controller');
const listEventsController  = require('./listEvents.controller');
const updateEventController = require('./updateEvent.controller');
const deleteEventController = require('./deleteEvent.controller');

module.exports = {
  createEventController,
  readEventController,
  listEventsController,
  updateEventController,
  deleteEventController
};
