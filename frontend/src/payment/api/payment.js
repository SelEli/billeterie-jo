import { apiFetch } from '../../common/utils/fetcher';

/**
 * Démarrer un paiement (mock ou live)
 * @param {number|string} ticketId - ID du ticket à payer
 */
export const startPayment = (ticketId) => {
  const numericId = Number(ticketId);
  if (Number.isNaN(numericId)) {
    throw new Error(`Invalid ticketId: ${ticketId}`);
  }

  return apiFetch('/payment/start', {
    method: 'POST',
    body: { ticketId: numericId }
  });
};

/**
 * Confirmer un paiement et valider le ticket côté back
 * @param {number|string} ticketId - ID du ticket à confirmer
 */
export const confirmPayment = (ticketId) => {
  const numericId = Number(ticketId);
  if (Number.isNaN(numericId)) {
    throw new Error(`Invalid ticketId: ${ticketId}`);
  }

  return apiFetch('/payment/confirm', {
    method: 'POST',
    body: { ticketId: numericId }
  });
};
