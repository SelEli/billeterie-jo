// src/verification/api/verification.js
import { apiFetch } from '../../common/utils/fetcher';

/**
 * Démarrer une vérification de ticket (ex: scan QR code)
 * @param {number|string} ticketId - ID du ticket à vérifier
 */
export const startVerification = (ticketId) => {
  const numericId = Number(ticketId);
  if (Number.isNaN(numericId)) {
    throw new Error(`Invalid ticketId: ${ticketId}`);
  }

  return apiFetch('/verification/start', {
    method: 'POST',
    body: { ticketId: numericId }
  });
};

/**
 * Confirmer une vérification de ticket (ex: agent sur place)
 * @param {number|string} ticketId - ID du ticket à confirmer
 */
export const confirmVerification = (ticketId) => {
  const numericId = Number(ticketId);
  if (Number.isNaN(numericId)) {
    throw new Error(`Invalid ticketId: ${ticketId}`);
  }

  return apiFetch('/verification/confirm', {
    method: 'POST',
    body: { ticketId: numericId }
  });
};

/**
 * Obtenir l’historique des vérifications
 * Utile pour les admins ou superviseurs
 */
export const getVerificationHistory = () => {
  return apiFetch('/verification/history', {
    method: 'GET'
  });
};
