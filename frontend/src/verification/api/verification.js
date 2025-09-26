import { apiFetch } from '../../common/utils/fetcher';

/**
 * Démarrer une vérification de ticket
 * @param {object} qrPayload - Payload complet du QR code
 */
export const startVerification = (qrPayload) => {
  if (!qrPayload?.ticketId) {
    throw new Error(`Invalid payload: ${JSON.stringify(qrPayload)}`);
  }

  return apiFetch('/verification/start', {
    method: 'POST',
    body: qrPayload
  });
};

/**
 * Confirmer une vérification de ticket
 * @param {object} qrPayload - Payload complet du QR code
 */
export const confirmVerification = (qrPayload) => {
  if (!qrPayload?.ticketId) {
    throw new Error(`Invalid payload: ${JSON.stringify(qrPayload)}`);
  }

  return apiFetch('/verification/confirm', {
    method: 'POST',
    body: qrPayload
  });
};
