// src/ticketing/api/ticket.js
import { apiFetch } from '../../common/utils/fetcher';

// Récupérer un ticket par ID
export const getTicket = (id) => apiFetch(`/tickets/${id}`);

// Lister les tickets (avec filtres éventuels : userId, pagination, etc.)
export const listTickets = (params) => apiFetch('/tickets', { params });

// Créer un ticket
export const createTicket = (data) =>
  apiFetch('/tickets', { method: 'POST', body: data });

// Mettre à jour un ticket
export const updateTicket = (id, data) =>
  apiFetch(`/tickets/${id}`, { method: 'PUT', body: data });

// Supprimer un ticket
export const deleteTicket = (id) =>
  apiFetch(`/tickets/${id}`, { method: 'DELETE' });
