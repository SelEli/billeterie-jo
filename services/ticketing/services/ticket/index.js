const { createTicket } = require('./createTicket.service');
const { readTicket   } = require('./readTicket.service');
const { listTickets  } = require('./listTickets.service');
const { updateTicket } = require('./updateTicket.service');
const { deleteTicket } = require('./deleteTicket.service');

module.exports = {
  createTicket,
  readTicket,
  listTickets,
  updateTicket,
  deleteTicket
};
