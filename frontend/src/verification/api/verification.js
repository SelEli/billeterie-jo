import { apiFetch } from '../../common/utils/fetcher';

/**
 * Démarrer une vérification de ticket
 * @param {object} qrPayload - { ticketId, signature }
 */
export const startVerification = (qrPayload) => {
  if (!qrPayload?.ticketId || !qrPayload?.signature) {
    throw new Error(`Invalid payload: ${JSON.stringify(qrPayload)}`);
  }

  return apiFetch('/verification/start', {
    method: 'POST',
    body: qrPayload
  });
};
