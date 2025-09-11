// src/ticketing/api/ticket.js
import { apiFetch } from '../../common/utils/fetcher';

export const listTickets = (params) =>
  apiFetch('/ticket', { params });

export const getTicket = (id, options = {}) => {
  if (id == null) {
    throw new Error('INVALID_TICKET_ID');
  }
  return apiFetch(`/ticket/${id}`, options);
};

export const createTicket = (data) =>
  apiFetch('/ticket', { method: 'POST', body: data });

export const updateTicket = (id, data) => {
  if (id == null) {
    throw new Error('INVALID_TICKET_ID');
  }
  return apiFetch(`/ticket/${id}`, { method: 'PUT', body: data });
};

export const deleteTicket = (id) => {
  if (id == null) {
    throw new Error('INVALID_TICKET_ID');
  }
  return apiFetch(`/ticket/${id}`, { method: 'DELETE' });
};

// Validation standard (paiement réussi)
export const validateTicket = (ticketId, extra = {}) => {
  if (ticketId == null) {
    throw new Error('INVALID_TICKET_ID');
  }
  return apiFetch('/ticket/validate', { method: 'POST', body: { ticketId, ...extra } });
};
