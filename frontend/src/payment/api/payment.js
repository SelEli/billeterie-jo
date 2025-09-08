// src/payment/api/payment.js
import { apiFetch } from '../../common/utils/fetcher';

// Initier un paiement (mock)
export const initiatePayment = (ticketId) =>
  apiFetch('/payment/initiate', { method: 'POST', body: { ticketId } });

// Confirmer un paiement et valider le ticket
export const confirmPayment = (ticketId) =>
  apiFetch('/ticket/validate', { method: 'POST', body: { ticketId } });

// Annuler un paiement
export const cancelPayment = (ticketId) =>
  apiFetch('/payment/cancel', { method: 'POST', body: { ticketId } });
