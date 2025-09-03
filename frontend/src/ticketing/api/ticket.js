// src/ticketing/api/ticket.js
import { apiFetch } from '../../common/utils/fetcher';

// Lister les tickets
export const listTickets = (params) =>
  apiFetch('/ticket', { params });

// Récupérer un ticket par ID
export const getTicket = (id) =>
  apiFetch(`/ticket/${id}`);

// Créer un ticket
export const createTicket = (data) =>
  apiFetch('/ticket', { method: 'POST', body: data });

// Mettre à jour un ticket
export const updateTicket = (id, data) =>
  apiFetch(`/ticket/${id}`, { method: 'PUT', body: data });

// Supprimer un ticket
export const deleteTicket = (id) =>
  apiFetch(`/ticket/${id}`, { method: 'DELETE' });

// Valider un ticket (simulation Payment)
export const validateTicket = (ticketId) =>
  apiFetch('/ticket/validate', { method: 'POST', body: { ticketId } });
