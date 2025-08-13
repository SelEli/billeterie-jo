const eventCreationService = require('./eventCreation.service');
const eventUpdateService = require('./eventUpdate.service');
const eventDeleteService = require('./eventDelete.service');
const { eventQueryService, eventReadService } = require('./eventQuery.service');

module.exports = {
  eventCreationService,
  eventUpdateService,
  eventDeleteService,
  eventQueryService,
  eventReadService
};
