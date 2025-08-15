// controllers/ticket/index.js
const { createTicketController } = require('./createTicket.controller');
const { readTicketController }   = require('./readTicket.controller');
const { listTicketsController }  = require('./listTickets.controller');
const { updateTicketController } = require('./updateTicket.controller');
const { deleteTicketController } = require('./deleteTicket.controller');

const logger = require('../../utils/logger');

// Vérification stricte des contrôleurs
[
  ['createTicketController', createTicketController],
  ['readTicketController', readTicketController],
  ['listTicketsController', listTicketsController],
  ['updateTicketController', updateTicketController],
  ['deleteTicketController', deleteTicketController]
].forEach(([name, fn]) => {
  if (typeof fn !== 'function') {
    logger.error(`❌ Contrôleur ${name} est undefined ou mal exporté`);
    throw new Error(`❌ Contrôleur ${name} est undefined ou mal exporté`);
  }
  logger.debug(`✅ Contrôleur ${name} chargé`);
});

module.exports = {
  createTicketController,
  readTicketController,
  listTicketsController,
  updateTicketController,
  deleteTicketController
};
