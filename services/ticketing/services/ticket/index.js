// services/ticket/index.js
// 🎯 Index des services Ticket
// Regroupe et exporte tous les services disponibles

const { createTicketService }   = require('./createTicket.service');
const { readTicketService }     = require('./readTicket.service');
const { listTicketsService }    = require('./listTickets.service');
const { updateTicketService }   = require('./updateTicket.service');
const { deleteTicketService }   = require('./deleteTicket.service');
const { validateTicketService } = require('./validateTicket.service');
const { verifyTicketService }   = require('./verifyTicket.service');

module.exports = {
  createTicketService,
  readTicketService,
  listTicketsService,
  updateTicketService,
  deleteTicketService,
  validateTicketService,
  verifyTicketService
};
