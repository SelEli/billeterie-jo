// utils/verificationCache.js
const cache = new Map(); // ticketId -> { payload, startedAt, mode }

const DEFAULT_TTL_MS = 5 * 60 * 1000; // 5 minutes

/**
 * Stocke temporairement des données de vérification pour un ticket
 * @param {number|string} ticketId
 * @param {object} data - { payload: any, mode?: string }
 */
function setVerificationData(ticketId, { payload, mode = 'live' }) {
  const numericId = Number(ticketId);
  if (Number.isNaN(numericId)) throw new Error(`Invalid ticketId: ${ticketId}`);

  cache.set(numericId, {
    payload,
    startedAt: Date.now(),
    mode
  });
}

/**
 * Récupère les données de vérification si elles sont encore valides
 * @param {number|string} ticketId
 * @returns {object|null}
 */
function getVerificationData(ticketId) {
  const numericId = Number(ticketId);
  const entry = cache.get(numericId);
  if (!entry) return null;

  // TTL check
  if (Date.now() - entry.startedAt > DEFAULT_TTL_MS) {
    cache.delete(numericId);
    return null;
  }
  return entry;
}

/**
 * Supprime les données de vérification pour un ticket
 * @param {number|string} ticketId
 */
function clearVerificationData(ticketId) {
  cache.delete(Number(ticketId));
}

module.exports = { setVerificationData, getVerificationData, clearVerificationData };
