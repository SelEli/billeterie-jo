const createTicketController = require('./createTicket.controller');
const readTicketController   = require('./readTicket.controller');
const listTicketsController  = require('./listTickets.controller');
const updateTicketController = require('./updateTicket.controller');
const deleteTicketController = require('./deleteTicket.controller');

module.exports = {
  createTicketController,
  readTicketController,
  listTicketsController,
  updateTicketController,
  deleteTicketController
};
