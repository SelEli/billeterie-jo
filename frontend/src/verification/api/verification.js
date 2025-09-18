// src/verification/api/verification.js
import { apiFetch } from '../../common/utils/fetcher';

/**
 * Vérifier un ticket via QR Code (mock)
 * On suppose que le QR Code contient { ticketId, hmac }.
 * @param {object} payload - Données extraites du QR Code
 * @param {number|string} payload.ticketId - ID du ticket
 * @param {string} payload.hmac - HMAC fourni dans le QR Code
 */
export const verifyTicket = ({ ticketId, hmac }) => {
  const numericId = Number(ticketId);
  if (Number.isNaN(numericId)) {
    throw new Error(`Invalid ticketId: ${ticketId}`);
  }
  if (!hmac || typeof hmac !== 'string') {
    throw new Error(`Invalid HMAC: ${hmac}`);
  }

  // Appel API vers le backend de vérification
  return apiFetch('/verification/check', {
    method: 'POST',
    body: { ticketId: numericId, hmac }
  });
};

/**
 * Forcer la validation d’un ticket (ex: agent sur place)
 * @param {number|string} ticketId - ID du ticket à forcer
 */
export const forceValidateTicket = (ticketId) => {
  const numericId = Number(ticketId);
  if (Number.isNaN(numericId)) {
    throw new Error(`Invalid ticketId: ${ticketId}`);
  }

  return apiFetch('/verification/force', {
    method: 'POST',
    body: { ticketId: numericId }
  });
};

/**
 * Obtenir l’historique des vérifications (mock)
 * Utile pour les admins ou superviseurs
 */
export const getVerificationHistory = () => {
  return apiFetch('/verification/history', {
    method: 'GET'
  });
};
