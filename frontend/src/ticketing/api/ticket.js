// src/ticketing/api/ticket.js
import { apiFetch } from '../../common/utils/fetcher';

export const listTickets = (params) =>
  apiFetch('/ticket', { params });

export const getTicket = (id) =>
  apiFetch(`/ticket/${id}`);

export const createTicket = (data) =>
  apiFetch('/ticket', { method: 'POST', body: data });

export const updateTicket = (id, data) =>
  apiFetch(`/ticket/${id}`, { method: 'PUT', body: data });

export const deleteTicket = (id) =>
  apiFetch(`/ticket/${id}`, { method: 'DELETE' });

// Validation standard (paiement réussi)
export const validateTicket = (ticketId, extra = {}) =>
  apiFetch('/ticket/validate', { method: 'POST', body: { ticketId, ...extra } });
