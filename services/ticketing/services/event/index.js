// services/event/index.js

const { createEventService } = require('./createEvent.service');
const { updateEventService } = require('./updateEvent.service');
const { deleteEventService } = require('./deleteEvent.service');
const { listEventsService }  = require('./listEvents.service');
const { readEventService }   = require('./readEvent.service');

module.exports = {
  createEventService,
  updateEventService,
  deleteEventService,
  listEventsService,
  readEventService
};
